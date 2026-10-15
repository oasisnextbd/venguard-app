/**
 * Device simulator: plays one VenGuard device against the live Firebase project, through the
 * same database paths and rules as real firmware (DEVICE_API.md → "Free plan (Spark) edition"
 * in OASIS_official_website/backend/connected-firebase). Uses the app's own device model
 * (src/lib/sim.ts), so it behaves exactly like the demo: 20 % LEL for 7 s confirms a leak,
 * the valve closes, the relay runs the fan until the air is clear, reset is by hand only.
 */
import "../styles.css";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  type DataSnapshot,
  connectDatabaseEmulator,
  getDatabase,
  onChildAdded,
  onValue,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
} from "firebase/database";
import { firebaseConfig } from "../lib/firebase";
import { type AppEvent, type Device, type EventType, manualReset, regulatorOff, remoteClose, startLeak, step } from "../lib/sim";

const $ = <T extends HTMLElement>(s: string) => document.querySelector(s) as T;
const app = initializeApp(firebaseConfig, "simulator");
const auth = getAuth(app);
const db = getDatabase(app);
if (import.meta.env.VITE_FIREBASE_EMULATORS) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectDatabaseEmulator(db, "127.0.0.1", 9000);
}
const KEY = "vg_sim_v1";
// Events the database rules accept from a device (regulator_off is an app-demo-only event).
const REPORTED: EventType[] = ["leak_confirmed", "valve_closed", "fan_on", "fan_off", "air_clear", "reset", "remote_close", "test", "battery_low"];

let id = "";
let dev: Device;
let online = true;
let lastSent = "";
let timers: number[] = [];
let stopCmd: (() => void) | null = null;

function log(msg: string) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()}  ${msg}`;
  $("#log").prepend(li);
}

// Restore the remembered ID and email (never the password).
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  const f = $<HTMLFormElement>("#login");
  if (saved.id) (f.elements.namedItem("id") as HTMLInputElement).value = saved.id;
  if (saved.email) (f.elements.namedItem("email") as HTMLInputElement).value = saved.email;
} catch { /* ignore */ }

$<HTMLFormElement>("#login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target as HTMLFormElement;
  const v = (n: string) => (f.elements.namedItem(n) as HTMLInputElement).value.trim();
  id = v("id").toUpperCase();
  const err = $("#login-error");
  err.hidden = true;
  try {
    await signInWithEmailAndPassword(auth, v("email"), v("password"));
    localStorage.setItem(KEY, JSON.stringify({ id, email: v("email") }));
    (f.elements.namedItem("password") as HTMLInputElement).value = "";
    await start();
  } catch (x) {
    err.textContent = `Could not connect: ${(x as { code?: string }).code || (x as Error).message}. Check the email/password, and that deviceAuth/${id} holds this user's UID.`;
    err.hidden = false;
  }
});

async function start() {
  dev = {
    id, siteId: id, name: { bn: id, en: id }, kit: "complete", gas: 2, history: [], valve: "open",
    fan: false, battery: 80, online: true, leaking: false, confirm: 0, alarm: false,
  };
  $<HTMLFormElement>("#login").hidden = true;
  $("#panel").hidden = false;
  $("#sim-id").textContent = id;
  onValue(ref(db, `devices/${id}/meta`), (s) => {
    const kit = s.val()?.kit === "detector_relay" ? "detector_relay" : "complete";
    dev = { ...dev, kit, valve: kit === "detector_relay" ? "none" : dev.valve === "none" ? "open" : dev.valve };
    render();
  }, (e) => log(`cannot read meta: ${e.message}`));
  // Close commands from the app: act, ack once, then clear (Spark edition).
  stopCmd = onChildAdded(ref(db, `devices/${id}/cmd`), (s: DataSnapshot) => void handleCommand(s.key!, s.val()), (e) => log(`cannot read commands: ${e.message}`));
  await sendState(true);
  await heartbeat();
  timers.push(window.setInterval(tick, 1000), window.setInterval(heartbeat, 60000));
  log("connected; heartbeat every 60 s");
}

async function handleCommand(cid: string, c: { type?: string; exp?: number }) {
  if (!online) return;
  if (c?.type !== "close" || !c.exp || c.exp < Date.now()) {
    log(`ignored command ${cid} (${c?.type || "?"}, expired or not 'close')`);
  } else if (dev.valve === "closed" || dev.valve === "none") {
    await set(ref(db, `devices/${id}/ack/${cid}`), { result: dev.valve === "none" ? "failed" : "already_closed" });
    log(`close request: ${dev.valve === "none" ? "no valve on this kit (failed)" : "already closed"}`);
  } else {
    const r = remoteClose(dev, Date.now());
    dev = r.device;
    await sendState(true);
    await report(r.events);
    await set(ref(db, `devices/${id}/ack/${cid}`), { result: "closed" });
    log("close request from the app: valve closed, ack sent");
  }
  await remove(ref(db, `devices/${id}/cmd/${cid}`));
  render();
}

async function tick() {
  if (!online) return;
  const r = step(dev, Date.now(), Math.random);
  dev = r.device;
  await report(r.events);
  await sendState(false);
  render();
}

async function report(events: AppEvent[]) {
  for (const e of events) {
    if (!REPORTED.includes(e.type)) continue;
    await push(ref(db, `devices/${id}/events`), { type: e.type, at: serverTimestamp() });
    log(`event: ${e.type}`);
  }
}

/** Send state when something visible changed (the firmware rule: gas moves ≥ 2 points or a flag changes). */
async function sendState(force: boolean) {
  const state = {
    valve: dev.valve,
    gasLEL: Math.round(dev.gas),
    alarm: dev.alarm,
    fan: dev.fan,
    detectorBattery: dev.battery ?? 0,
    ...(dev.kit === "complete" ? { valveBattery: Math.min(100, (dev.battery ?? 0) + 5) } : {}),
    rfLinkOk: true,
    fw: "sim-1",
  };
  const prev = lastSent ? JSON.parse(lastSent) : null;
  const changed = !prev || prev.valve !== state.valve || prev.alarm !== state.alarm || prev.fan !== state.fan
    || prev.detectorBattery !== state.detectorBattery || Math.abs(prev.gasLEL - state.gasLEL) >= 2;
  if (!force && !changed) return;
  lastSent = JSON.stringify(state);
  await set(ref(db, `devices/${id}/state`), state);
}

async function heartbeat() {
  if (online) await set(ref(db, `hb/${id}`), serverTimestamp());
}

function render() {
  $("#sim-gas").textContent = `${Math.round(dev.gas)} % LEL`;
  $("#sim-valve").textContent = dev.valve;
  $("#sim-fan").textContent = dev.fan ? "on" : "off";
  $("#sim-alarm").textContent = dev.alarm ? "LEAK" : dev.confirm > 0 ? `checking ${dev.confirm}s` : "no";
  $("#sim-battery").textContent = `${dev.battery}%`;
  $("#sim-kit").textContent = dev.kit === "complete" ? "complete" : "detector + relay";
  const pill = $("#sim-online");
  pill.textContent = online ? "Online" : "Offline";
  pill.className = `pill ${online ? "pill--safe" : "pill--offline"}`;
}

document.querySelectorAll<HTMLButtonElement>("[data-act]").forEach((b) => b.addEventListener("click", async () => {
  const now = Date.now();
  switch (b.dataset.act) {
    case "leak": dev = startLeak(dev); log("leak started (gas rises; confirmed after 7 s above 20 %)"); break;
    case "regulator": dev = regulatorOff(dev, now).device; log("regulator turned off by hand"); break;
    case "reset": {
      const r = manualReset(dev, now);
      if (r.events.length) { dev = r.device; await report(r.events); await sendState(true); log("lever reset: valve open"); }
      else log("reset refused: valve not closed, or the air is not clear yet");
      break;
    }
    case "battery":
      dev = { ...dev, battery: (dev.battery ?? 80) < 20 ? 80 : 12 };
      if ((dev.battery ?? 80) < 20) await report([{ id: "", at: now, deviceId: id, type: "battery_low" }]);
      await sendState(true);
      break;
    case "test": await report([{ id: "", at: now, deviceId: id, type: "test" }]); break;
    case "offline": online = !online; log(online ? "back online" : "offline: no heartbeat or state (the app shows offline after 3 minutes)"); if (online) { await heartbeat(); await sendState(true); } break;
    case "disconnect":
      timers.forEach(clearInterval); timers = []; stopCmd?.(); await signOut(auth);
      location.reload();
      return;
  }
  render();
}));
