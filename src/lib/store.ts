/**
 * App state: one small store, read by components through useApp().
 * Settings persist on the phone (localStorage).
 * Device data comes only from the VenGuard Firebase backend (live.ts), which pushes updates through
 * setLive(). There is no demo: the team tests with the emulators in the team dashboard.
 */
import { useSyncExternalStore } from "react";
import type { Lang } from "./i18n";
import { translate } from "./i18n";
import { placeName } from "./place";
import { notify, phoneUI, startAlarmSound, startAlarmVibration, stopAlarmSound, vibrate } from "./platform";
import type { AppEvent, Device, Site } from "./sim";

export type ThemePref = "auto" | "light" | "dark";
export interface Contact {
  name: string;
  phone: string;
}

export type CloseStatus = "sent" | "closed" | "already_closed" | "failed";

export interface State {
  /** The web app has passed its welcome screen (the Android app opens with its splash instead). */
  started: boolean;
  /** undefined = still checking, null = signed out */
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

function load(): Pick<State, "started" | "lang" | "theme" | "sound" | "family"> {
  const fallback = { started: false, lang: "bn" as Lang, theme: "auto" as ThemePref, sound: true, family: [] as Contact[] };
  let saved: typeof fallback & { mode?: string } = fallback;
  try {
    saved = { ...fallback, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    /* keep the defaults */
  }
  const { started, lang, theme, sound, family } = saved;
  // Browsers that used the old demo (mode "demo") see the welcome screen again.
  return { started: phoneUI || (started && saved.mode !== "demo"), lang, theme, sound, family };
}

let state: State = {
  ...load(),
  auth: undefined,
  closeReq: {},
  sites: [],
  devices: {},
  events: [],
  alarmFor: null,
  mitigated: null,
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

/** For live.ts: push backend updates into the store. */
export function setLive(patch: Partial<State>) {
  set(patch);
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

const live = () => import("./live");

export function startLive() {
  void live().then((m) => m.init());
}

export const actions = {
  /** Web app welcome screen: "Sign in to my VenGuard". Someone still signed in goes straight home. */
  startLive: () => {
    set({ started: true });
    startLive();
  },
  signOut: () => {
    stopAlarmSound();
    void live().then((m) => m.signOut());
    set({ started: phoneUI, auth: null, sites: [], devices: {}, events: [], alarmFor: null, mitigated: null });
  },
  setLang: (lang: Lang) => set({ lang }),
  setTheme: (theme: ThemePref) => set({ theme }),
  setSound: (sound: boolean) => {
    if (!sound) stopAlarmSound();
    set({ sound });
  },
  addContact: (c: Contact) => {
    set({ family: [...state.family, c].slice(0, 3) });
    void live().then((m) => m.saveFamily(state.family));
  },
  removeContact: (i: number) => {
    set({ family: state.family.filter((_, j) => j !== i) });
    void live().then((m) => m.saveFamily(state.family));
  },
  remoteClose: (id: string) => void live().then((m) => m.sendClose(id)),
  closeAlarm: () => {
    stopAlarmSound();
    set({ alarmFor: null });
  },
  mute: () => stopAlarmSound(),
  dismissMitigated: () => set({ mitigated: null }),
  /**
   * Remove a device from this account: it disappears from Home and History. The device itself
   * keeps working; it can be added again with its ID and sticker code.
   */
  removeDevice: async (id: string): Promise<void> => {
    if (!state.devices[id]) return;
    if (state.alarmFor === id) {
      stopAlarmSound();
      set({ alarmFor: null });
    }
    await (await live()).unclaimDevice(id);
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
