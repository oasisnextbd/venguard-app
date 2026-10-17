import { Logo } from "../components/Logo";
import { CornerSettings } from "../components/QuickSettings";
import { actions } from "../lib/store";
import { useT } from "../lib/useT";

export function Welcome() {
  const { t, lang } = useT();
  return (
    <main className="welcome">
      <CornerSettings lang={false} />
      <div className="welcome-inner">
        <Logo height={52} />
        <p className="welcome-tagline">{t("tagline")}</p>
        <p className="lead">{t("welcomeLead")}</p>
        <div className="seg" role="group" aria-label={t("chooseLang")}>
          <button type="button" lang="bn" aria-pressed={lang === "bn"} onClick={() => actions.setLang("bn")}>বাংলা</button>
          <button type="button" lang="en" aria-pressed={lang === "en"} onClick={() => actions.setLang("en")}>English</button>
        </div>
        <button type="button" className="btn btn--primary btn--block" onClick={actions.start}>{t("startDemo")}</button>
        <button type="button" className="btn btn--secondary btn--block" onClick={actions.startLive}>{t("signInReal")}</button>
        <p className="small muted">{t("demoNote")}</p>
      </div>
    </main>
  );
}
