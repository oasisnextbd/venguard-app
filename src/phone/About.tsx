/** Android app: About us. Facts only, from the website's content (see lib/company.ts). */
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { ADVISOR, EMAIL, PHONE_DISPLAY, TEAM, WEBSITE, WHATSAPP } from "../lib/company";
import { useT } from "../lib/useT";

const RECOGNITION = ["rec_fair", "rec_cohort", "rec_koica", "rec_uihp"] as const;

export function About() {
  const { t, n, lang } = useT();
  return (
    <main className="page about">
      <h1 className="page-title">{t("tabAbout")}</h1>
      <section className="panel about-hero">
        <Logo height={40} />
        <p>{t("welcomeLead")}</p>
      </section>

      <h2 className="section-title">{t("aboutVision")}</h2>
      <section className="panel"><p>{t("vision")}</p></section>

      <h2 className="section-title">{t("aboutRecognition")}</h2>
      <section className="panel list">
        {RECOGNITION.map((k) => <p key={k} className="list-link"><Icon name="award" /><span>{t(k)}</span></p>)}
      </section>

      <h2 className="section-title">{t("aboutTeam")}</h2>
      <section className="panel list">
        {TEAM.map((m) => (
          <p key={m.name} className="list-link about-person" lang="en">
            <span className="avatar">{m.name.replace(/^(Md|M)\.?\s/, "").charAt(0)}</span>
            <span><strong>{m.name}</strong><span className="small muted">{m.role}</span></span>
          </p>
        ))}
        <p className="list-link about-person">
          <span className="avatar"><Icon name="award" size={20} /></span>
          <span><strong lang="en">{ADVISOR.name}</strong><span className="small muted">{t("aboutAdvisor")} · {ADVISOR.role[lang]}</span></span>
        </p>
      </section>

      <h2 className="section-title">{t("aboutContact")}</h2>
      <section className="panel list">
        <a className="list-link" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener"><Icon name="whatsapp" />{t("help")} · {n(PHONE_DISPLAY)}<Icon name="chevron" size={18} /></a>
        <a className="list-link" href={`mailto:${EMAIL}`}><Icon name="mail" />{EMAIL}<Icon name="chevron" size={18} /></a>
        <a className="list-link" href={WEBSITE} target="_blank" rel="noopener"><Icon name="globe" />{t("website")}<Icon name="chevron" size={18} /></a>
      </section>
    </main>
  );
}
