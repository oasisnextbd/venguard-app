/**
 * Android app leak alert. Instead of a separate alarm page, the whole app turns red (PhoneShell) and this
 * banner shows while the leak lasts (top of every screen; under the gas bar on that device's own screen,
 * so the bar stays in view). The alarm sound and vibration keep going until the air is clear.
 * When the air is clear again, MitigatedMessage shows (with a phone notification from the store).
 */
import { useEffect } from "react";
import { Icon } from "../components/Icon";
import { actions, useApp } from "../lib/store";
import { useT } from "../lib/useT";

function usePlace(id: string | null): string {
  const { devices, sites } = useApp();
  const { lang } = useT();
  const d = id ? devices[id] : undefined;
  if (!d) return "";
  const s = sites.find((x) => x.id === d.siteId);
  return s ? `${s.name[lang]} · ${d.name[lang]}` : d.name[lang];
}

export function LeakBanner({ id }: { id: string }) {
  const { devices, family, sound } = useApp();
  const { t } = useT();
  const place = usePlace(id);
  const d = devices[id];
  if (!d) return null;
  return (
    <section className="leak-banner" role="alert">
      <span className="leak-banner-icon"><Icon name="flame" size={28} /></span>
      <div className="leak-banner-text">
        <strong>{t("alarmTitle", { name: place })}</strong>
        <span>{t("alarmDo")}</span>
        <span className="leak-banner-actions">
          {sound && <button type="button" className="btn btn--outline-light btn--sm" onClick={actions.mute}><Icon name="mute" size={16} />{t("mute")}</button>}
          {family[0] && <a className="btn btn--light btn--sm" href={`tel:${family[0].phone}`}><Icon name="phone" size={16} />{t("callFamily")}</a>}
        </span>
      </div>
    </section>
  );
}

export function MitigatedMessage({ id }: { id: string }) {
  const { t } = useT();
  const place = usePlace(id);
  useEffect(() => {
    const timer = window.setTimeout(actions.dismissMitigated, 10000);
    return () => window.clearTimeout(timer);
  }, [id]);
  return (
    <div className="mitigated" role="status">
      <span className="mitigated-icon"><Icon name="check" size={22} /></span>
      <span className="mitigated-text"><strong>{t("mitigatedTitle")}</strong><span>{t("mitigatedBody", { place })}</span></span>
      <button type="button" className="mitigated-x" onClick={actions.dismissMitigated} aria-label={t("close")}><Icon name="x" size={18} /></button>
    </div>
  );
}
