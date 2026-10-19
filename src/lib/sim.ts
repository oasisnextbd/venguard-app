/**
 * VenGuard device model and simulator: the device page (simulator.html) runs it, the app uses its types
 * and gas-bar helpers, and the team dashboard's emulators copy it (website repo, team-dashboard/js/emusim.js).
 *
 * Models the VenGuard safety chain exactly as the website specifies it
 * (venguard/templates/pages/how-it-works.html in the website repo):
 *   1. the detector watches gas level (% of LEL) all the time
 *   2. above THRESHOLD for CONFIRM_SECONDS it confirms a leak
 *   3. the valve closes (complete kit only) and the relay starts the exhaust fan
 *   4. the fan runs until the air is clear
 *   5. the valve stays closed until a person resets the lever at the stove
 *
 * Pure functions only: no timers, no storage, no randomness of its own
 * (callers pass `rand`), so the behaviour is unit-tested in sim.test.ts.
 * When real devices connect, this file is replaced by live data; the screens
 * only depend on the Device / AppEvent shapes below.
 */

export const THRESHOLD = 20; // % LEL
export const CONFIRM_SECONDS = 7;
export const CLEAR_LEVEL = 5; // % LEL: below this the air counts as clear
export const BATTERY_LOW = 20; // %

/*
 * Gas bar on the Android device screen. The detector reports % LEL (100 % LEL = the LFL, the least gas in
 * air that can burn). LPG's flammable range in air is about 1.8 % to 9.5 % by volume (typical figures for
 * propane–butane mixes; CTO to confirm the values for the sensor and the gas sold in Bangladesh).
 * The bar is drawn in two parts so the region where VenGuard acts stays readable: 0 to the LFL fills the
 * first BAR_LFL of the bar, the LFL to the HFL the part up to BAR_HFL, and anything richer the rest.
 */
export const LPG_LFL_VOL = 1.8; // % by volume
export const LPG_HFL_VOL = 9.5; // % by volume
export const BAR_LFL = 0.7;
export const BAR_HFL = 0.92;

/** % LEL → % by volume in air. */
export function toVolume(lel: number): number {
  return (lel * LPG_LFL_VOL) / 100;
}

/** Where a reading sits on the gas bar, 0–1. */
export function barPosition(lel: number): number {
  if (lel <= 0) return 0;
  if (lel <= 100) return (BAR_LFL * lel) / 100;
  const vol = toVolume(lel);
  if (vol <= LPG_HFL_VOL) return BAR_LFL + ((BAR_HFL - BAR_LFL) * (vol - LPG_LFL_VOL)) / (LPG_HFL_VOL - LPG_LFL_VOL);
  return Math.min(1, BAR_HFL + ((1 - BAR_HFL) * (vol - LPG_HFL_VOL)) / LPG_HFL_VOL);
}

/**
 * Bar colour: green in clean air, fading to yellow at the alarm threshold; above it red, getting deeper
 * up to the LFL. It skips orange, which is the brand colour and never a status colour.
 */
export function gasColour(lel: number): string {
  if (lel <= THRESHOLD) {
    const hue = 145 - (95 * Math.max(0, lel)) / THRESHOLD;
    return `hsl(${hue.toFixed(0)} 72% 45%)`;
  }
  const t = Math.min(1, (lel - THRESHOLD) / (100 - THRESHOLD));
  return `hsl(354 ${(70 + 12 * t).toFixed(0)}% ${(54 - 16 * t).toFixed(0)}%)`;
}

export type Kit = "complete" | "detector_relay";
export type Valve = "open" | "closed" | "none";

export interface Text {
  bn: string;
  en: string;
}

export interface Device {
  id: string;
  siteId: string;
  name: Text;
  kit: Kit;
  gas: number; // % LEL
  history: number[]; // last HISTORY readings, oldest first
  valve: Valve;
  fan: boolean;
  battery: number | null; // %, null = not reported (live devices)
  online: boolean;
  leaking: boolean; // simulator: a leak source is active
  confirm: number; // seconds spent above THRESHOLD
  alarm: boolean; // leak confirmed and not yet cleared
}

export interface Site {
  id: string;
  kind: "home" | "building";
  name: Text;
  area: Text;
}

export type EventType =
  | "leak_confirmed"
  | "valve_closed"
  | "fan_on"
  | "fan_off"
  | "air_clear"
  | "reset"
  | "remote_close"
  | "regulator_off"
  | "test"
  | "battery_low"
  | "tamper";

export interface AppEvent {
  id: string;
  at: number; // epoch ms
  deviceId: string;
  type: EventType;
}

export type Status = "danger" | "checking" | "gas_off" | "offline" | "battery" | "safe";

export const HISTORY = 60;

/** One second of simulated time for one device. Returns the new device and any events. */
export function step(d: Device, now: number, rand: () => number): { device: Device; events: AppEvent[] } {
  if (!d.online) return { device: d, events: [] };
  const events: AppEvent[] = [];
  const ev = (type: EventType) => events.push({ id: `${d.id}-${now}-${type}`, at: now, deviceId: d.id, type });
  const n: Device = { ...d };

  // Gas level: inflow while leaking (a closed valve stops the source), outflow from air exchange.
  const inflow = n.leaking && n.valve !== "closed" ? 6 + rand() * 2 : 0;
  const outflow = n.fan ? 4.5 : 1.2;
  const baseline = 1 + rand() * 2.5; // normal kitchen air
  n.gas = Math.max(baseline, Math.min(60, n.gas + inflow - outflow));
  n.gas = Math.round(n.gas * 10) / 10;
  n.history = [...d.history, n.gas].slice(-HISTORY);

  // Confirmation window: brief whiffs never trigger anything.
  n.confirm = n.gas >= THRESHOLD ? n.confirm + 1 : 0;

  if (!n.alarm && n.confirm >= CONFIRM_SECONDS) {
    n.alarm = true;
    ev("leak_confirmed");
    if (n.valve === "open") {
      n.valve = "closed";
      n.leaking = false;
      ev("valve_closed");
    }
    if (!n.fan) {
      n.fan = true;
      ev("fan_on");
    }
  }

  if (n.alarm && !n.leaking && n.gas < CLEAR_LEVEL) {
    n.alarm = false;
    ev("air_clear");
    if (n.fan) {
      n.fan = false;
      ev("fan_off");
    }
  }

  return { device: n, events };
}

/** Simulator: start a leak at this device. */
export function startLeak(d: Device): Device {
  return d.online ? { ...d, leaking: true } : d;
}

/** Connected plan: close the valve remotely. Opening remotely is never possible. */
export function remoteClose(d: Device, now: number): { device: Device; events: AppEvent[] } {
  if (d.valve !== "open" || !d.online) return { device: d, events: [] };
  return {
    device: { ...d, valve: "closed", leaking: false },
    events: [{ id: `${d.id}-${now}-remote_close`, at: now, deviceId: d.id, type: "remote_close" }],
  };
}

/** Simulator: the person turns the cylinder regulator off by hand (detector + relay kits have no valve). */
export function regulatorOff(d: Device, now: number): { device: Device; events: AppEvent[] } {
  if (!d.leaking) return { device: d, events: [] };
  return {
    device: { ...d, leaking: false },
    events: [{ id: `${d.id}-${now}-regulator_off`, at: now, deviceId: d.id, type: "regulator_off" }],
  };
}

/** Whether the manual reset at the stove is allowed now. */
export function canReset(d: Device): boolean {
  return d.valve === "closed" && !d.alarm && d.gas < THRESHOLD;
}

/** Simulator: the person lifts the reset lever at the stove. */
export function manualReset(d: Device, now: number): { device: Device; events: AppEvent[] } {
  if (!canReset(d)) return { device: d, events: [] };
  return {
    device: { ...d, valve: "open" },
    events: [{ id: `${d.id}-${now}-reset`, at: now, deviceId: d.id, type: "reset" }],
  };
}

/** One status per device, most urgent first. */
export function statusOf(d: Device): Status {
  if (!d.online) return "offline";
  if (d.alarm) return "danger";
  if (d.confirm > 0) return "checking";
  if (d.valve === "closed") return "gas_off";
  if (d.battery !== null && d.battery < BATTERY_LOW) return "battery";
  return "safe";
}

const RANK: Record<Status, number> = { danger: 0, checking: 1, gas_off: 2, offline: 3, battery: 4, safe: 5 };

export function worst(statuses: Status[]): Status {
  return statuses.reduce<Status>((a, b) => (RANK[b] < RANK[a] ? b : a), "safe");
}

export function needsAttention(s: Status): boolean {
  return s !== "safe";
}
