/**
 * In-app updates for the Android app: new screens arrive without reinstalling the APK.
 * On start the app confirms the running bundle works (otherwise the updater rolls back to the last good
 * one), then reads updates/latest.json from our own GitHub Pages; a newer bundle is downloaded in the
 * background, checked against its checksum (CRC32 in updater 6.x; the download itself is HTTPS from our
 * own site), and used from the next time the app opens. If a new bundle fails to start, the updater
 * goes back to the previous one by itself (notifyAppReady not called within 10 s).
 * Changes to the Android shell itself (permissions, plugins, icon) still need a new APK: CI then raises
 * "minNative" in package.json, and older phones keep their bundle until the new APK is installed.
 * The web app updates through its service worker instead; nothing here runs in a browser.
 */
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { isNative } from "./platform";
import { UPDATE_ORIGIN, shouldUpdate } from "./updatePolicy";

/** Version of the installed APK (Android shell), e.g. "0.3.0"; "" in a browser or if unknown. */
export async function nativeVersion(): Promise<string> {
  if (!isNative) return "";
  try {
    return (await CapacitorUpdater.current()).native;
  } catch {
    return "";
  }
}

export async function startUpdates(): Promise<void> {
  if (!isNative) return;
  try {
    await CapacitorUpdater.notifyAppReady();
  } catch {
    /* plugin missing in an old shell: nothing to do */
    return;
  }
  try {
    const res = await fetch(`${UPDATE_ORIGIN}updates/latest.json?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return;
    const m: unknown = await res.json();
    if (!shouldUpdate(m, __APP_BUILD__, await nativeVersion())) return;
    const label = `${m.version}+${m.build}`;
    const { bundles } = await CapacitorUpdater.list();
    const have = bundles.find((b) => b.version === label && b.status !== "error");
    const bundle = have ?? (await CapacitorUpdater.download({ url: m.url, version: label, checksum: m.checksum }));
    await CapacitorUpdater.next({ id: bundle.id });
  } catch {
    /* offline or a failed download: try again next time; the app keeps working as it is */
  }
}
