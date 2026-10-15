import { actions, useApp } from "../lib/store";
import { useT } from "../lib/useT";
import { Icon } from "./Icon";

/** Whether the app is showing the night theme right now ("auto" follows the phone). */
export function isDark(theme: "auto" | "light" | "dark"): boolean {
  return theme === "dark" || (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

/** One tap between Day and Night. Account still offers Auto (follow the phone). */
export function ThemeToggle() {
  const { theme } = useApp();
  const { t } = useT();
  const dark = isDark(theme);
  const label = t(dark ? "toDay" : "toNight");
  return (
    <button type="button" className="icon-btn" onClick={() => actions.setTheme(dark ? "light" : "dark")} aria-label={label} title={label}>
      <Icon name={dark ? "sun" : "moon"} size={20} />
    </button>
  );
}

/** Switch between Bangla and English; shows the language it switches to. */
export function LangToggle() {
  const { lang } = useApp();
  const other = lang === "bn" ? "en" : "bn";
  return (
    <button type="button" className="icon-btn lang-btn" lang={other} onClick={() => actions.setLang(other)} aria-label={other === "en" ? "English" : "বাংলা"} title={other === "en" ? "English" : "বাংলা"}>
      {other === "en" ? "EN" : "বাং"}
    </button>
  );
}

/** Top-right controls on screens without the tab bar (welcome, sign-in). */
export function CornerSettings({ lang = true }: { lang?: boolean }) {
  return (
    <div className="corner-settings">
      {lang && <LangToggle />}
      <ThemeToggle />
    </div>
  );
}
