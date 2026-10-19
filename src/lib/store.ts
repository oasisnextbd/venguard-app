/**
 * App state: one small store, read by components through useApp().
 * Settings persist on the phone (localStorage).
 * Two sources of device data:
 *   demo — the simulator (sim.ts), ticked here once a second;
 *   live — the VenGuard Firebase backend (live.ts), which pushes updates through setLive().
 */
import { useSyncExternalStore } from "react";
import { DEMO_DEVICE, SITES, seedDevices } from "./demo";
import type { Lang } from "./i18n";
import { translate } from "./i18n";
import { placeName } from "./place";
import { notify, phoneUI, startAlarmSound, startAlarmVibration, stopAlarmSound, vibrate } from "./platform";
import {
  type AppEvent,
  type Device,
  type Site,
  manualReset,
  regulatorOff,
  remoteClose,
  startLeak,
  step,
} from "./sim";

export type ThemePref = "auto" | "light" | "dark";
export interface Contact {
  name: string;
  phone: string;
}

export type Mode = "demo" | "live";
export type CloseStatus = "sent" | "closed" | "already_closed" | "failed";

export interface State {
  started: boolean;
  mode: Mode;
  /** live mode: undefined = still checking, null = signed out */
  auth: { uid: string; who: string } | null | undefined; // who: email or phone number
  closeReq: Record<string, CloseStatus>;
  lang: Lang;
  theme: ThemePref;
  sound: boolean;
  family: Contact[];
  sites: Site[];
  devices: Record<string, Device>;
  events: AppEvent[]; // newest first
  alarmFor: string | null; // device id of the open alarm sheet
  mitigated: string | null; // phone layout: device whose leak has just cleared (green message)
}

const KEY = "vg_app_v1";

/** Demo data (web app only: the Android app has no demo, see load()). */
const demoSites = () => SITES;
const demoDevices = () => seedDevices();
const demoEvents = (): AppEvent[] => [];
const MAX_EVENTS = 100;

function load(): Pick<State, "started" | "mode" | "lang" | "theme" | "sound" | "family"> {
  const fallback = { started: false, mode: "demo" as Mode, lang: "bn" as Lang, theme: "auto" as ThemePref, sound: true, family: [] as Contact[] };
  let saved = fallback;
  try {
    saved = { ...fallback, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    /* keep the defaults */
  }
  // The Android app is for real VenGuard accounts only: no demo devices, straight to sign-in.
  return phoneUI ? { ...saved, started: true, mode: "live" } : saved;
}

const saved = load();
let state: State = {
  ...saved,
  auth: undefined,
  closeReq: {},
  sites: saved.mode === "demo" ? demoSites() : [],
  devices: saved.mode === "demo" ? demoDevices() : {},
  events: saved.mode === "demo" ? demoEvents() : [],
  alarmFor: null,
  mitigated: null,
};

const listeners = new Set<() => void>();

function save() {
  const { started, mode, lang, theme, sound, family } = state;
  try {
    localStorage.setItem(KEY, JSON.stringify({ started, mode, lang, theme, sound, family }));
  } catch {
    /* private mode: settings last for this session only */
  }
}

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  save();
  listeners.forEach((l) => l());
}

function apply(id: string, fn: (d: Device, now: number) => { device: Device; events: AppEvent[] } | Device) {
  if (!state.devices[id]) return; // e.g. removed meanwhile
  const now = Date.now();
  const r = fn(state.devices[id], now);
  const res = "device" in r ? r : { device: r, events: [] };
  set({ devices: { ...state.devices, [id]: res.device }, events: [...res.events.reverse(), ...state.events].slice(0, MAX_EVENTS) });
}

/** For live.ts: push backend updates into the store. */
export function setLive(patch: Partial<State>) {
  if (state.mode === "live") set(patch);
}

function placeOf(deviceId: string): string {
  const d = state.devices[deviceId];
  if (!d) return "";
  return placeName(d, state.sites.find((s) => s.id === d.siteId), state.lang);
}

export function raiseAlarm(deviceId: string) {
  const place = placeOf(deviceId);
  set({ alarmFor: deviceId, mitigated: null });
  if (state.sound) startAlarmSound();
  if (phoneUI) startAlarmVibration();
  else void vibrate();
  void notify(translate(state.lang, "notifTitle"), place);
}

/**
 * The air at a device is clear again after a leak (gas back below CLEAR_LEVEL). The alarm sound stops.
 * Phone layout: the red background goes, and a notification and a green message say the leak is mitigated.
 * The web app keeps its alarm sheet open until the person closes it.
 */
export function clearAlarm(deviceId: string) {
  if (state.alarmFor === deviceId) stopAlarmSound();
  if (!phoneUI) return;
  const place = placeOf(deviceId);
  set({ alarmFor: state.alarmFor === deviceId ? null : state.alarmFor, mitigated: deviceId });
  void notify(translate(state.lang, "mitigatedTitle"), translate(state.lang, "mitigatedBody", { place }));
}

function tick() {
  if (state.mode !== "demo") return;
  const now = Date.now();
  const devices: Record<string, Device> = {};
  const fresh: AppEvent[] = [];
  for (const [id, d] of Object.entries(state.devices)) {
    const r = step(d, now, Math.random);
    devices[id] = r.device;
    fresh.push(...r.events);
  }
  state = { ...state, devices, events: [...fresh.reverse(), ...state.events].slice(0, MAX_EVENTS) };
  listeners.forEach((l) => l());
  const confirmed = fresh.find((e) => e.type === "leak_confirmed");
  if (confirmed) raiseAlarm(confirmed.deviceId);
  for (const e of fresh) if (e.type === "air_clear") clearAlarm(e.deviceId);
  // The alarm sound stops by itself once the air is clear.
  if (state.alarmFor && !state.devices[state.alarmFor].alarm) stopAlarmSound();
}

let interval: number | null = null;
export function startSimulation() {
  if (interval === null) interval = window.setInterval(tick, 1000);
}

const live = () => import("./live");

export function startLive() {
  void live().then((m) => m.init());
}

export const actions = {
  /** Back to the welcome screen (demo or sign-in). Keeps a live sign-in: "Sign in" then goes straight home. */
  showWelcome: () => {
    if (phoneUI) return;
    stopAlarmSound();
    set({ started: false, alarmFor: null });
  },
  start: () => { if (!phoneUI) set({ started: true, mode: "demo", sites: demoSites(), devices: demoDevices(), events: demoEvents() }); },
  startLive: () => {
    set({ started: true, mode: "live", sites: [], devices: {}, events: [], alarmFor: null, mitigated: null });
    startLive();
  },
  switchToDemo: () => {
    if (phoneUI) return;
    stopAlarmSound();
    set({ mode: "demo", sites: demoSites(), devices: demoDevices(), events: demoEvents(), alarmFor: null, mitigated: null });
  },
  signOut: () => {
    stopAlarmSound();
    void live().then((m) => m.signOut());
    if (phoneUI) set({ auth: null, sites: [], devices: {}, events: [], alarmFor: null, mitigated: null });
    else set({ started: false, mode: "demo", auth: undefined, sites: demoSites(), devices: demoDevices(), events: demoEvents(), alarmFor: null, mitigated: null });
  },
  setLang: (lang: Lang) => set({ lang }),
  setTheme: (theme: ThemePref) => set({ theme }),
  setSound: (sound: boolean) => {
    if (!sound) stopAlarmSound();
    set({ sound });
  },
  addContact: (c: Contact) => {
    set({ family: [...state.family, c].slice(0, 3) });
    if (state.mode === "live") void live().then((m) => m.saveFamily(state.family));
  },
  removeContact: (i: number) => {
    set({ family: state.family.filter((_, j) => j !== i) });
    if (state.mode === "live") void live().then((m) => m.saveFamily(state.family));
  },
  leak: (id = DEMO_DEVICE) => apply(id, (d) => startLeak(d)),
  remoteClose: (id: string) => {
    if (state.mode === "live") void live().then((m) => m.sendClose(id));
    else apply(id, remoteClose);
  },
  regulatorOff: (id: string) => apply(id, regulatorOff),
  reset: (id: string) => apply(id, manualReset),
  closeAlarm: () => {
    stopAlarmSound();
    set({ alarmFor: null });
  },
  mute: () => stopAlarmSound(),
  dismissMitigated: () => set({ mitigated: null }),
  /**
   * Remove a device from this account (live): it disappears from Home and History. The device itself
   * keeps working; it can be added again with its ID and sticker code.
   */
  removeDevice: async (id: string): Promise<void> => {
    if (state.mode !== "live" || !state.devices[id]) return;
    if (state.alarmFor === id) {
      stopAlarmSound();
      set({ alarmFor: null });
    }
    await (await live()).unclaimDevice(id);
  },
  restartDemo: () => {
    stopAlarmSound();
    set({ devices: demoDevices(), events: demoEvents(), alarmFor: null, mitigated: null });
  },
};

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useApp(): State {
  return useSyncExternalStore(subscribe, () => state);
}

/** For non-React code and tests. */
export const getState = () => state;
