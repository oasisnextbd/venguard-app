import { describe, expect, it } from "vitest";
import {
  BAR_HFL,
  BAR_LFL,
  CONFIRM_SECONDS,
  LPG_HFL_VOL,
  THRESHOLD,
  barPosition,
  gasColour,
  toVolume,
  type Device,
  canReset,
  manualReset,
  regulatorOff,
  remoteClose,
  startLeak,
  statusOf,
  step,
  worst,
} from "./sim";

const base: Device = {
  id: "d1",
  siteId: "s1",
  name: { bn: "বাসা", en: "Home" },
  kit: "complete",
  gas: 2,
  history: [],
  valve: "open",
  fan: false,
  battery: 80,
  online: true,
  leaking: false,
  confirm: 0,
  alarm: false,
};

const mid = () => 0.5;

function run(d: Device, seconds: number) {
  let device = d;
  const events = [];
  for (let i = 0; i < seconds; i++) {
    const r = step(device, i * 1000, mid);
    device = r.device;
    events.push(...r.events);
  }
  return { device, events };
}

describe("safety chain", () => {
  it("stays safe in normal kitchen air", () => {
    const { device, events } = run(base, 120);
    expect(device.gas).toBeLessThan(5);
    expect(events).toHaveLength(0);
    expect(statusOf(device)).toBe("safe");
  });

  it("ignores a brief whiff shorter than the confirmation window", () => {
    const whiff = { ...base, gas: 25 };
    const { device, events } = run(whiff, CONFIRM_SECONDS - 2);
    expect(device.valve).toBe("open");
    expect(events.some((e) => e.type === "leak_confirmed")).toBe(false);
  });

  it("confirms a real leak, closes the valve and starts the fan", () => {
    const { device, events } = run(startLeak(base), 15);
    const types = events.map((e) => e.type);
    expect(types).toEqual(expect.arrayContaining(["leak_confirmed", "valve_closed", "fan_on"]));
    expect(device.valve).toBe("closed");
    expect(device.fan).toBe(true);
    expect(device.leaking).toBe(false);
  });

  it("stops the fan once the air is clear but keeps the valve closed", () => {
    const { device, events } = run(startLeak(base), 90);
    expect(events.map((e) => e.type)).toContain("air_clear");
    expect(device.fan).toBe(false);
    expect(device.valve).toBe("closed");
    expect(statusOf(device)).toBe("gas_off");
  });

  it("only allows the manual reset once the air is safe", () => {
    const during = run(startLeak(base), 12).device;
    expect(canReset(during)).toBe(false);
    expect(manualReset(during, 0).device.valve).toBe("closed");
    const after = run(during, 90).device;
    expect(canReset(after)).toBe(true);
    expect(manualReset(after, 0).device.valve).toBe("open");
  });

  it("detector + relay kits run the fan but cannot close the gas", () => {
    const kit = { ...base, kit: "detector_relay" as const, valve: "none" as const };
    const { device } = run(startLeak(kit), 20);
    expect(device.fan).toBe(true);
    expect(device.valve).toBe("none");
    expect(device.leaking).toBe(true);
    const off = regulatorOff(device, 0).device;
    expect(off.leaking).toBe(false);
    expect(run(off, 120).device.alarm).toBe(false);
  });

  it("closes remotely but never opens remotely", () => {
    const closed = remoteClose(base, 0).device;
    expect(closed.valve).toBe("closed");
    expect(remoteClose(closed, 0).events).toHaveLength(0);
  });

  it("does nothing while offline", () => {
    const off = { ...base, online: false, leaking: true };
    expect(step(off, 0, mid).device).toBe(off);
    expect(statusOf(off)).toBe("offline");
  });

  it("ranks the most urgent status first", () => {
    expect(worst(["safe", "battery", "danger", "offline"])).toBe("danger");
    expect(worst(["safe", "safe"])).toBe("safe");
  });
});

describe("gas bar (Android device screen)", () => {
  it("puts the LFL and HFL at their marks and never leaves the bar", () => {
    expect(barPosition(0)).toBe(0);
    expect(barPosition(100)).toBeCloseTo(BAR_LFL);
    expect(barPosition((LPG_HFL_VOL / toVolume(1)))).toBeCloseTo(BAR_HFL);
    expect(barPosition(100000)).toBe(1);
    expect(barPosition(-5)).toBe(0);
  });

  it("only moves forward as the gas rises", () => {
    let last = -1;
    for (let lel = 0; lel <= 1000; lel += 5) {
      const p = barPosition(lel);
      expect(p).toBeGreaterThanOrEqual(last);
      last = p;
    }
  });

  it("goes green → yellow at the alarm threshold → red, deepest at the LFL, never orange", () => {
    expect(gasColour(0)).toBe("hsl(145 72% 45%)");
    expect(gasColour(THRESHOLD)).toBe("hsl(50 72% 45%)");
    expect(gasColour(THRESHOLD + 1)).toMatch(/^hsl\(354 /);
    expect(gasColour(100)).toBe("hsl(354 82% 38%)");
    expect(gasColour(400)).toBe(gasColour(100));
    for (let lel = 0; lel <= 200; lel++) {
      const hue = Number(gasColour(lel).slice(4).split(" ")[0]);
      expect(hue >= 50 || hue === 354).toBe(true); // no orange hues (roughly 15–45)
    }
  });
});
