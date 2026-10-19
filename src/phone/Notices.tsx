/**
 * Android app: messages set in the team dashboard (Settings → VenGuard app), shown under the top bar.
 * - The notice (English, also in the Bangla app): can be closed; a new or changed notice shows again.
 * - "Install the new version": when this APK is older than the minimum version set there. It never
 *   blocks the app: alarms and live status keep working on the old version.
 */
import { useCallback, useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { type AppSettings, fetchAppSettings } from "../lib/appSettings";
import { UPDATE_ORIGIN, needsNewApk } from "../lib/updatePolicy";
import { nativeVersion } from "../lib/updates";
import { useT } from "../lib/useT";

const CHECK_EVERY_MS = 10 * 60 * 1000;

/** Home sizes its device panels to the screen; it subtracts the notices' height (--pnotices-h). */
let observer: ResizeObserver | null = null;
function trackHeight(el: HTMLElement | null) {
  observer?.disconnect();
  observer = null;
  const set = (px: number) => document.documentElement.style.setProperty("--pnotices-h", `${Math.round(px)}px`);
  if (!el) return set(0);
  observer = new ResizeObserver(() => set(el.offsetHeight));
  observer.observe(el);
}
const DISMISSED = "vg_notice_closed";

function readClosed(): string {
  try { return localStorage.getItem(DISMISSED) || ""; } catch { return ""; }
}

export function Notices() {
  const { t } = useT();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [native, setNative] = useState("");
  const [closed, setClosed] = useState(readClosed);
  const [updateClosed, setUpdateClosed] = useState(false);
  const measure = useCallback((el: HTMLDivElement | null) => trackHeight(el), []);

  useEffect(() => {
    const load = () => void fetchAppSettings().then(setSettings);
    load();
    void nativeVersion().then(setNative);
    const timer = window.setInterval(load, CHECK_EVERY_MS);
    const onShow = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", onShow);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", onShow); };
  }, []);

  if (!settings) return null;
  const notice = settings.notice_en;
  const key = notice;
  const showNotice = !!notice && closed !== key;
  const showUpdate = !updateClosed && !!native && needsNewApk(native, settings.min_version);
  if (!showNotice && !showUpdate) return null;

  const close = () => {
    try { localStorage.setItem(DISMISSED, key); } catch { /* private storage off: closes for this session */ }
    setClosed(key);
  };

  return (
    <div className="pnotices" ref={measure}>
      {showUpdate && (
        <div className="pnotice pnotice--update" role="status">
          <Icon name="alert" size={20} />
          <span className="pnotice-text"><strong>{t("updateNeeded")}</strong><span>{t("updateNeededSub")}</span>
            <a className="btn btn--primary btn--sm" href={`${UPDATE_ORIGIN}VenGuard.apk`}>{t("download")}</a></span>
          <button type="button" className="pnotice-x" onClick={() => setUpdateClosed(true)} aria-label={t("close")}><Icon name="x" size={18} /></button>
        </div>
      )}
      {showNotice && (
        <div className="pnotice" role="status">
          <Icon name="info" size={20} />
          <span className="pnotice-text" lang="en">{notice}</span>
          <button type="button" className="pnotice-x" onClick={close} aria-label={t("close")}><Icon name="x" size={18} /></button>
        </div>
      )}
    </div>
  );
}
