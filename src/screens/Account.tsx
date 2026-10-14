import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { type Permission, notificationPermission, requestNotifications } from "../lib/platform";
import { type ThemePref, actions, useApp } from "../lib/store";
import { useT } from "../lib/useT";

const WHATSAPP = "8801302829487"; // company WhatsApp (same as the website's site.json)
const WEBSITE = "https://oasisnextbd.github.io/OASIS_official_website/VENGuard/";

export function Account() {
  const { lang, theme, sound } = useApp();
  const { t, n } = useT();
  const [perm, setPerm] = useState<Permission>("unsupported");
  useEffect(() => { void notificationPermission().then(setPerm); }, []);

  const themes: [ThemePref, "themeAuto" | "themeDay" | "themeNight"][] = [["auto", "themeAuto"], ["light", "themeDay"], ["dark", "themeNight"]];

  return (
    <main className="page">
      <h1 className="page-title">{t("accountTitle")}</h1>

      <section className="panel plan">
        <div className="row">
          <span><span className="eyebrow">{t("plan")}</span><strong className="plan-price">{t("planPrice")}</strong></span>
          <span className="pill pill--safe"><Icon name="check" size={16} />{t("planDemo")}</span>
        </div>
        <p className="small muted">{t("planNote")}</p>
      </section>

      <section className="panel settings">
        <div className="row">
          <strong>{t("chooseLang")}</strong>
          <span className="seg" role="group" aria-label={t("chooseLang")}>
            <button type="button" lang="bn" aria-pressed={lang === "bn"} onClick={() => actions.setLang("bn")}>বাংলা</button>
            <button type="button" lang="en" aria-pressed={lang === "en"} onClick={() => actions.setLang("en")}>EN</button>
          </span>
        </div>
        <div className="row">
          <strong>{t("theme")}</strong>
          <span className="seg" role="group" aria-label={t("theme")}>
            {themes.map(([v, k]) => <button key={v} type="button" aria-pressed={theme === v} onClick={() => actions.setTheme(v)}>{t(k)}</button>)}
          </span>
        </div>
        <div className="row">
          <strong>{t("sound")}</strong>
          <button type="button" className="switch" role="switch" aria-checked={sound} aria-label={t("sound")} onClick={() => actions.setSound(!sound)}><span /></button>
        </div>
        {perm !== "unsupported" && (
          <div className="row">
            <strong>{t("notifications")}</strong>
            {perm === "granted" ? <span className="pill pill--safe"><Icon name="check" size={16} />{t("allowed")}</span>
              : perm === "denied" ? <span className="small muted">{t("blocked")}</span>
              : <button type="button" className="btn btn--secondary btn--sm" onClick={() => void requestNotifications().then(setPerm)}>{t("allow")}</button>}
          </div>
        )}
      </section>

      <section className="panel list">
        <a className="list-link" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener"><Icon name="whatsapp" />{t("help")}<Icon name="chevron" size={18} /></a>
        <a className="list-link" href={WEBSITE} target="_blank" rel="noopener"><Icon name="globe" />{t("website")}<Icon name="chevron" size={18} /></a>
        <button type="button" className="list-link" onClick={actions.restartDemo}><Icon name="restart" />{t("resetDemo")}<Icon name="chevron" size={18} /></button>
      </section>

      <p className="small muted center">{t("demoNote")}<br />{t("version")} {n(__APP_VERSION__)}</p>
    </main>
  );
}
