/**
 * Live data from the VenGuard Firebase backend (free Spark plan).
 * Loaded on demand (dynamic import) so the demo never downloads Firebase.
 *
 * Database layout and the device side: OASIS_official_website/backend/connected-firebase
 * (DEVICE_API.md, "Free plan (Spark) edition"). The security rules there decide what the
 * app may do: read its own devices, claim one with its sticker code, and send "close".
 * There is deliberately no way to send "open".
 */
import { type FirebaseApp, initializeApp } from "firebase/app";
import {
  type Auth,
  type ConfirmationResult,
  GoogleAuthProvider,
  RecaptchaVerifier,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import {
  type Database,
  type DataSnapshot,
  type Unsubscribe,
  connectDatabaseEmulator,
  getDatabase,
  limitToLast,
  onValue,
  push,
  query,
  ref,
  set,
  update,
} from "firebase/database";
import { OFFLINE_AFTER_S, firebaseConfig } from "./firebase";
import { isNative } from "./platform";
import { type AppEvent, type Device, type EventType, type Site, HISTORY, THRESHOLD } from "./sim";
import { type Contact, clearAlarm, getState, raiseAlarm, setLive } from "./store";

let app: FirebaseApp | null = null;
let auth: Auth;
let db: Database;
let serverOffset = 0;
const serverNow = () => Date.now() + serverOffset;

interface Label { name: string; area?: string; kind?: "home" | "restaurant" | "building" }
interface Raw {
  label: Label;
  kit?: "complete" | "detector_relay";
  state?: { valve?: string; gasLEL?: number; alarm?: boolean; fan?: boolean; detectorBattery?: number; valveBattery?: number };
  hb?: number;
  events: AppEvent[];
  history: number[];
  wasAlarm: boolean;
}

const raw = new Map<string, Raw>();
const watchers = new Map<string, Unsubscribe[]>();
let userWatchers: Unsubscribe[] = [];
let onlineTimer: number | null = null;

const EVENT_TYPES: EventType[] = ["leak_confirmed", "valve_closed", "fan_on", "fan_off", "air_clear", "reset", "remote_close", "test", "battery_low", "tamper"];

/* ---------------- sign-in ---------------- */

export function init() {
  if (app) return;
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  auth.languageCode = getState().lang;
  // Inside the Android app the browser reCAPTCHA cannot run, so sign-in there works only with the
  // test phone numbers set in the Firebase console. Real SMS on Android needs the native Firebase
  // plugin (later, with google-services.json). The web version uses reCAPTCHA and real numbers.
  if (isNative) auth.settings.appVerificationDisabledForTesting = true;
  db = getDatabase(app);
  // Automated tests run against the local Firebase emulators (never in a published build).
  if (import.meta.env.VITE_FIREBASE_EMULATORS) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectDatabaseEmulator(db, "127.0.0.1", 9000);
    auth.settings.appVerificationDisabledForTesting = true;
  }
  onValue(ref(db, ".info/serverTimeOffset"), (s) => { serverOffset = Number(s.val()) || 0; });
  onAuthStateChanged(auth, (user) => {
    stopWatching();
    if (user) {
      setLive({ auth: { uid: user.uid, who: user.email || user.phoneNumber || "" } });
      watchUser(user.uid);
    } else {
      setLive({ auth: null, devices: {}, sites: [], events: [] });
    }
  });
}

let confirmation: ConfirmationResult | null = null;
let verifier: RecaptchaVerifier | null = null;

/*
 * Three ways in, all free on the Spark plan except real SMS:
 *   Google  — web only (Google blocks its sign-in page inside app WebViews; the Android app needs
 *             the native Firebase plugin for this, later);
 *   email + password — web and Android;
 *   phone   — test numbers from the Firebase console (real SMS needs a paid plan).
 * Devices belong to the account (uid), not to the sign-in method.
 */

export async function signInGoogle(): Promise<void> {
  init();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithPopup(auth, provider);
}

export async function signInEmail(email: string, password: string): Promise<void> {
  init();
  await signInWithEmailAndPassword(auth, email, password);
}

export async function createAccount(email: string, password: string): Promise<void> {
  init();
  await createUserWithEmailAndPassword(auth, email, password);
}

/** Firebase hides whether the address has an account, so the app always says "if it exists". */
export async function resetPassword(email: string): Promise<void> {
  init();
  await sendPasswordResetEmail(auth, email);
}

/** Phone step 1: send the code. `phone` is a Bangladeshi mobile number like 01XXXXXXXXX. */
export async function sendCode(phone: string, containerId: string): Promise<void> {
  init();
  verifier?.clear();
  verifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  confirmation = await signInWithPhoneNumber(auth, "+88" + phone, verifier);
}

/** Phone step 2: confirm the 6-digit code. */
export async function confirmCode(code: string): Promise<void> {
  if (!confirmation) throw new Error("auth/missing-verification-id");
  await confirmation.confirm(code);
}

export async function signOut() {
  stopWatching();
  if (app) await fbSignOut(auth);
}

export type ErrorKey =
  | "wrongCode" | "tooMany" | "badPhone" | "notAllowed" | "signInFailed"
  | "wrongPassword" | "emailInUse" | "weakPassword" | "badEmail" | "popupBlocked" | "cancelled";

/** Map Firebase errors to translation keys. */
export function errorKey(e: unknown): ErrorKey {
  const code = (e as { code?: string })?.code || "";
  if (code.includes("popup-closed-by-user") || code.includes("cancelled-popup-request")) return "cancelled";
  if (code.includes("popup-blocked")) return "popupBlocked";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) return "wrongPassword";
  if (code.includes("email-already-in-use")) return "emailInUse";
  if (code.includes("weak-password")) return "weakPassword";
  if (code.includes("invalid-email") || code.includes("missing-email")) return "badEmail";
  if (code.includes("invalid-verification-code") || code.includes("code-expired")) return "wrongCode";
  if (code.includes("too-many-requests") || code.includes("quota-exceeded")) return "tooMany";
  if (code.includes("invalid-phone-number")) return "badPhone";
  if (code.includes("operation-not-allowed") || code.includes("billing")) return "notAllowed";
  return "signInFailed";
}

/* ---------------- data ---------------- */

function watchUser(uid: string) {
  userWatchers.push(
    onValue(ref(db, `users/${uid}/devices`), (s) => {
      const labels = (s.val() || {}) as Record<string, Label>;
      for (const id of [...watchers.keys()]) if (!labels[id]) unwatchDevice(id);
      for (const [id, label] of Object.entries(labels)) {
        const r = raw.get(id);
        if (r) r.label = label;
        else watchDevice(id, label);
      }
      publish();
    }),
    onValue(ref(db, `users/${uid}/family`), (s) => {
      const list = Object.values((s.val() || {}) as Record<string, Contact>);
      setLive({ family: list });
    }),
  );
  onlineTimer = window.setInterval(publish, 30000); // re-evaluate "offline" from heartbeat age
}

function watchDevice(id: string, label: Label) {
  const r: Raw = { label, events: [], history: [], wasAlarm: false };
  raw.set(id, r);
  const base = `devices/${id}`;
  watchers.set(id, [
    onValue(ref(db, `${base}/meta`), (s) => { r.kit = s.val()?.kit; publish(); }, ignore),
    onValue(ref(db, `${base}/state`), (s) => {
      r.state = s.val() || undefined;
      if (typeof r.state?.gasLEL === "number") r.history = [...r.history, r.state.gasLEL].slice(-HISTORY);
      publish();
      const alarm = !!r.state?.alarm;
      if (alarm && !r.wasAlarm) raiseAlarm(id);
      if (!alarm && r.wasAlarm) clearAlarm(id);
      r.wasAlarm = alarm;
    }, ignore),
    onValue(ref(db, `hb/${id}`), (s) => { r.hb = Number(s.val()) || undefined; publish(); }, ignore),
    onValue(query(ref(db, `${base}/events`), limitToLast(30)), (s) => {
      r.events = [];
      s.forEach((c: DataSnapshot) => {
        const v = c.val() as { type?: string; at?: number };
        if (v && EVENT_TYPES.includes(v.type as EventType)) r.events.push({ id: c.key!, at: Number(v.at) || 0, deviceId: id, type: v.type as EventType });
      });
      publish();
    }, ignore),
  ]);
}

function ignore() {
  /* permission denied while a claim is still being written; the next update brings the data */
}

function unwatchDevice(id: string) {
  watchers.get(id)?.forEach((u) => u());
  watchers.delete(id);
  raw.delete(id);
}

function stopWatching() {
  userWatchers.forEach((u) => u());
  userWatchers = [];
  for (const id of [...watchers.keys()]) unwatchDevice(id);
  if (onlineTimer !== null) window.clearInterval(onlineTimer);
  onlineTimer = null;
}

/** Turn raw backend data into the shapes the screens already use (sim.ts). */
function publish() {
  const devices: Record<string, Device> = {};
  const sites: Site[] = [];
  let events: AppEvent[] = [];
  for (const [id, r] of raw) {
    const s = r.state;
    const gas = typeof s?.gasLEL === "number" ? s.gasLEL : 0;
    const batteries = [s?.detectorBattery, s?.valveBattery].filter((b): b is number => typeof b === "number");
    const alarm = !!s?.alarm;
    const name = { bn: r.label.name, en: r.label.name };
    const area = { bn: r.label.area || "", en: r.label.area || "" };
    sites.push({ id, kind: "home", name, area });
    devices[id] = {
      id,
      siteId: id,
      name,
      kit: r.kit === "detector_relay" ? "detector_relay" : "complete",
      gas,
      history: r.history.length ? r.history : [gas],
      valve: r.kit === "detector_relay" || s?.valve === "none" ? "none" : s?.valve === "closed" ? "closed" : "open",
      fan: !!s?.fan,
      battery: batteries.length ? Math.min(...batteries) : null,
      online: !!r.hb && serverNow() - r.hb < OFFLINE_AFTER_S * 1000,
      leaking: false,
      confirm: gas >= THRESHOLD && !alarm ? 1 : 0,
      alarm,
    };
    events = events.concat(r.events);
  }
  events.sort((a, b) => b.at - a.at);
  setLive({ devices, sites, events });
}

/* ---------------- actions ---------------- */

/** Add a device to this account with the code on its sticker. */
export async function claimDevice(id: string, code: string, label: Label): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("auth/not-signed-in");
  await update(ref(db), {
    [`devices/${id}/owners/${uid}`]: code,
    [`users/${uid}/devices/${id}`]: { name: label.name, area: label.area || "", kind: label.kind || "home" },
  });
}

/** Remove a device from this account (the rules let people delete only their own ownership). */
export async function unclaimDevice(id: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("auth/not-signed-in");
  await update(ref(db), { [`users/${uid}/devices/${id}`]: null, [`devices/${id}/owners/${uid}`]: null });
}

/** Ask the device to close its valve. The rules accept only "close", expiring within 30 minutes. */
export async function sendClose(id: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const reqs = { ...getState().closeReq, [id]: "sent" as const };
  setLive({ closeReq: reqs });
  try {
    const cmd = push(ref(db, `devices/${id}/cmd`), { type: "close", exp: serverNow() + 10 * 60 * 1000, by: uid });
    await cmd;
    const stop = onValue(ref(db, `devices/${id}/ack/${cmd.key}`), (s) => {
      const result = s.val()?.result;
      if (result === "closed" || result === "already_closed" || result === "failed") {
        setLive({ closeReq: { ...getState().closeReq, [id]: result } });
        stop();
      }
    }, ignore);
  } catch {
    setLive({ closeReq: { ...getState().closeReq, [id]: "failed" } });
  }
}

export async function saveFamily(list: Contact[]): Promise<void> {
  const uid = auth?.currentUser?.uid;
  if (uid) await set(ref(db, `users/${uid}/family`), list);
}
