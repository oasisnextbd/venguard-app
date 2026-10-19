/**
 * In-app updates (Android app): which published bundle a phone should take. Pure, tested in
 * updatePolicy.test.ts. The phone side is lib/updates.ts; CI publishes the bundle (see README).
 */

/** What CI publishes at updates/latest.json next to the web app. */
export interface UpdateManifest {
  version: string; // package.json version, e.g. "0.3.0"
  build: number; // CI run number; higher = newer
  url: string; // the bundle zip
  checksum: string; // of the zip, lower-case hex: CRC32 (8) for updater 6.x, which checks it; SHA-256 (64) for later versions
  minNative: string; // oldest Android shell (APK versionName) this bundle runs on
}

/** Updates come only from here; anything else in a manifest is ignored. */
export const UPDATE_ORIGIN = "https://oasisnextbd.github.io/venguard-app/";

/** Compares dotted versions ("0.10.0" > "0.9.2"); missing parts count as 0, anything after "-" or "+" is ignored. */
export function compareVersions(a: string, b: string): number {
  const parts = (v: string) => v.split(/[-+]/)[0].split(".").map((x) => parseInt(x, 10) || 0);
  const pa = parts(a);
  const pb = parts(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return 0;
}

export function isManifest(m: unknown): m is UpdateManifest {
  const x = m as UpdateManifest;
  return !!x && typeof x.version === "string" && Number.isInteger(x.build) && typeof x.url === "string"
    && /^([0-9a-f]{8}|[0-9a-f]{64})$/.test(x.checksum ?? "") && typeof x.minNative === "string";
}

/**
 * Take the bundle when it is newer than what runs now, the installed shell is new enough for it,
 * and it comes from our own address.
 */
export function shouldUpdate(m: unknown, runningBuild: number, nativeVersion: string): m is UpdateManifest {
  if (!isManifest(m)) return false;
  if (!m.url.startsWith(UPDATE_ORIGIN)) return false;
  if (m.build <= runningBuild) return false;
  return compareVersions(nativeVersion, m.minNative) >= 0;
}

/**
 * Minimum version set in the team dashboard: true when this shell is too old and the person
 * should install the new APK. Empty or unreadable minimum = no prompt.
 */
export function needsNewApk(nativeVersion: string, minimum: string | undefined): boolean {
  if (!minimum || !/^\d+(\.\d+)*$/.test(minimum.trim())) return false;
  return compareVersions(nativeVersion, minimum.trim()) < 0;
}
