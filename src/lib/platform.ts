/**
 * Phone features behind one small interface, so screens never care whether
 * they run in the Android app (Capacitor plugins) or in a browser (web APIs).
 */
import { Capacitor } from "@capacitor/core";
import { Haptics } from "@capacitor/haptics";
import { LocalNotifications } from "@capacitor/local-notifications";
import { StatusBar, Style } from "@capacitor/status-bar";

export const isNative = Capacitor.isNativePlatform();

export type Permission = "granted" | "denied" | "prompt" | "unsupported";

export async function notificationPermission(): Promise<Permission> {
  if (isNative) {
    const p = await LocalNotifications.checkPermissions();
    return p.display === "granted" ? "granted" : p.display === "denied" ? "denied" : "prompt";
  }
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission === "default" ? "prompt" : Notification.permission;
}

export async function requestNotifications(): Promise<Permission> {
  if (isNative) {
    const p = await LocalNotifications.requestPermissions();
    return p.display === "granted" ? "granted" : "denied";
  }
  if (!("Notification" in window)) return "unsupported";
  const r = await Notification.requestPermission();
  return r === "default" ? "prompt" : r;
}

let notifId = 1;

export async function notify(title: string, body: string): Promise<void> {
  try {
    if (isNative) {
      await LocalNotifications.schedule({ notifications: [{ id: notifId++, title, body }] });
      return;
    }
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.showNotification(title, { body, icon: "icons/icon-192.png", tag: "venguard-alarm" });
    else new Notification(title, { body });
  } catch {
    /* notifications are a bonus; the in-app alarm always shows */
  }
}

export async function vibrate(pattern: number[] = [400, 200, 400, 200, 800]): Promise<void> {
  try {
    if (isNative) {
      for (const ms of pattern.filter((_, i) => i % 2 === 0)) await Haptics.vibrate({ duration: ms });
    } else navigator.vibrate?.(pattern);
  } catch {
    /* not available */
  }
}

/* Alarm tone: two-tone beeps from the Web Audio API (no audio files to ship). */
let ctx: AudioContext | null = null;
let timer: number | null = null;

export function startAlarmSound(): void {
  if (timer !== null) return;
  try {
    ctx = ctx ?? new AudioContext();
    const beep = (freq: number, at: number) => {
      if (!ctx) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + at);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + 0.28);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + at);
      o.stop(ctx.currentTime + at + 0.3);
    };
    const cycle = () => {
      beep(1760, 0);
      beep(1320, 0.35);
    };
    cycle();
    timer = window.setInterval(cycle, 900);
  } catch {
    /* audio blocked until the user has interacted; the visual alarm still shows */
  }
}

export function stopAlarmSound(): void {
  if (timer !== null) window.clearInterval(timer);
  timer = null;
}

export async function setStatusBar(dark: boolean): Promise<void> {
  if (!isNative) return;
  try {
    await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
    await StatusBar.setBackgroundColor({ color: dark ? "#07192C" : "#FFFFFF" });
  } catch {
    /* older Android versions */
  }
}
