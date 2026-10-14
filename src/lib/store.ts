/**
 * App state: one small store, read by components through useApp().
 * Settings and family contacts persist on the phone (localStorage).
 * Device data comes from the demo simulator; a later update swaps the
 * `tick` source for live data from the VenGuard backend.
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

export interface State {
  started: boolean;
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

function load(): Pick<State, "started" | "lang" | "theme" | "sound" | "family"> {
  const fallback = { started: false, lang: "bn" as Lang, theme: "auto" as ThemePref, sound: true, family: [] as Contact[] };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return fallback;
  }
}

let state: State = {
  ...load(),
  sites: SITES,
  devices: seedDevices(),
  events: [],
  alarmFor: null,
};

const listeners = new Set<() => void>();

function save() {
  const { started, lang, theme, sound, family } = state;
  try {
    localStorage.setItem(KEY, JSON.stringify({ started, lang, theme, sound, family }));
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

function raiseAlarm(deviceId: string) {
  const d = state.devices[deviceId];
  const site = state.sites.find((s) => s.id === d.siteId);
  const place = site ? `${site.name[state.lang]} · ${d.name[state.lang]}` : d.name[state.lang];
  set({ alarmFor: deviceId });
  if (state.sound) startAlarmSound();
  void vibrate();
  void notify(translate(state.lang, "notifTitle"), place);
}

function tick() {
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

export const actions = {
  start: () => set({ started: true }),
  setLang: (lang: Lang) => set({ lang }),
  setTheme: (theme: ThemePref) => set({ theme }),
  setSound: (sound: boolean) => {
    if (!sound) stopAlarmSound();
    set({ sound });
  },
  addContact: (c: Contact) => set({ family: [...state.family, c].slice(0, 3) }),
  removeContact: (i: number) => set({ family: state.family.filter((_, j) => j !== i) }),
  leak: (id = DEMO_DEVICE) => apply(id, (d) => startLeak(d)),
  remoteClose: (id: string) => apply(id, remoteClose),
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
