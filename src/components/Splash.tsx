/**
 * Opening screen of the Android app (not the web app): the reversed logo and the motto on navy, shown once
 * when the app starts, then it fades into the app. Android's own start-up screen before it is plain navy
 * (android/app/src/main/res/values/splash.xml), so the two read as one screen.
 */
import { useEffect, useState } from "react";
import { useT } from "../lib/useT";

const BASE = import.meta.env.BASE_URL;
const SHOW_MS = 1600;
const FADE_MS = 400;

export function Splash({ onDone }: { onDone: () => void }) {
  const { t } = useT();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fade = window.setTimeout(() => setLeaving(true), SHOW_MS);
    const done = window.setTimeout(() => {
      document.documentElement.classList.remove("vg-booting");
      onDone();
    }, SHOW_MS + FADE_MS);
    return () => { window.clearTimeout(fade); window.clearTimeout(done); };
  }, [onDone]);

  return (
    <div className={leaving ? "splash splash--leaving" : "splash"} aria-hidden="true">
      <img className="splash-logo" src={`${BASE}brand/VenGuard_Logo_Primary_Reversed_RGB.svg`} width={220} height={57} alt="" />
      <p className="splash-motto" lang="en">{t("motto")}</p>
    </div>
  );
}
