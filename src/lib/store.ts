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
import { notify, startAlarmSound, stopAlarmSound, vibrate } from "./platform";
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
  auth: { uid: string; phone: string } | null | undefined;
  closeReq: Record<string, CloseStatus>;
  lang: Lang;
  theme: ThemePref;
  sound: boolean;
  family: Contact[];
  sites: Site[];
  devices: Record<string, Device>;
  events: AppEvent[]; // newest first
  alarmFor: string | null; // device id of the open alarm sheet
}

const KEY = "vg_app_v1";
const MAX_EVENTS = 100;

function load(): Pick<State, "started" | "mode" | "lang" | "theme" | "sound" | "family"> {
  const fallback = { started: false, mode: "demo" as Mode, lang: "bn" as Lang, theme: "auto" as ThemePref, sound: true, family: [] as Contact[] };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return fallback;
  }
}

const saved = load();
let state: State = {
  ...saved,
  auth: undefined,
  closeReq: {},
  sites: saved.mode === "demo" ? SITES : [],
  devices: saved.mode === "demo" ? seedDevices() : {},
  events: [],
  alarmFor: null,
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
  const now = Date.now();
  const r = fn(state.devices[id], now);
  const res = "device" in r ? r : { device: r, events: [] };
  set({ devices: { ...state.devices, [id]: res.device }, events: [...res.events.reverse(), ...state.events].slice(0, MAX_EVENTS) });
}

/** For live.ts: push backend updates into the store. */
export function setLive(patch: Partial<State>) {
  if (state.mode === "live") set(patch);
}

export function raiseAlarm(deviceId: string) {
  const d = state.devices[deviceId];
  const site = state.sites.find((s) => s.id === d.siteId);
  const place = site ? `${site.name[state.lang]} · ${d.name[state.lang]}` : d.name[state.lang];
  set({ alarmFor: deviceId });
  if (state.sound) startAlarmSound();
  void vibrate();
  void notify(translate(state.lang, "notifTitle"), place);
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
  start: () => set({ started: true, mode: "demo", sites: SITES, devices: seedDevices(), events: [] }),
  startLive: () => {
    set({ started: true, mode: "live", sites: [], devices: {}, events: [], alarmFor: null });
    startLive();
  },
  switchToDemo: () => {
    stopAlarmSound();
    set({ mode: "demo", sites: SITES, devices: seedDevices(), events: [], alarmFor: null });
  },
  signOut: () => {
    stopAlarmSound();
    void live().then((m) => m.signOut());
    set({ started: false, mode: "demo", auth: undefined, sites: SITES, devices: seedDevices(), events: [], alarmFor: null });
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
  restartDemo: () => {
    stopAlarmSound();
    set({ devices: seedDevices(), events: [], alarmFor: null });
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
