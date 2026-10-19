/**
 * Team dashboard → Settings → VenGuard app: a notice for everyone using the app (Bangla and English) and
 * the minimum app version (older APKs are asked to install the new one). Stored in Firestore at
 * settings/app, which the database rules let anyone read (website repo: backend/connected-firebase/
 * firestore.rules). Read over plain HTTPS so the Firebase SDK is not needed for it.
 */
import { firebaseConfig } from "./firebase";

export interface AppSettings {
  notice_bn: string;
  notice_en: string;
  min_version: string;
}

const EMPTY: AppSettings = { notice_bn: "", notice_en: "", min_version: "" };

/** Firestore REST document → AppSettings (missing or non-text fields become ""). */
export function parseAppSettings(doc: unknown): AppSettings {
  const fields = (doc as { fields?: Record<string, { stringValue?: unknown }> } | null)?.fields ?? {};
  const text = (k: keyof AppSettings) => {
    const v = fields[k]?.stringValue;
    return typeof v === "string" ? v.trim().slice(0, 500) : "";
  };
  return { notice_bn: text("notice_bn"), notice_en: text("notice_en"), min_version: text("min_version") };
}

export async function fetchAppSettings(): Promise<AppSettings> {
  const { projectId, apiKey } = firebaseConfig;
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/settings/app?key=${apiKey}`, { cache: "no-store" });
    return res.ok ? parseAppSettings(await res.json()) : EMPTY;
  } catch {
    return EMPTY; // offline: no notice
  }
}
