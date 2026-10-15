import { useEffect, useRef } from "react";
import { Icon } from "./Icon";
import { go } from "../lib/router";
import { actions, useApp } from "../lib/store";
import { useT } from "../lib/useT";

/** Full-screen leak alarm. Opens when a leak is confirmed anywhere. */
export function AlarmSheet() {
  const { alarmFor, devices, sites, family, mode } = useApp();
  const { t, lang } = useT();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (alarmFor) ref.current?.focus(); }, [alarmFor]);
  if (!alarmFor) return null;
  const d = devices[alarmFor];
  const site = sites.find((s) => s.id === d.siteId)!;
  const place = site.kind === "building" ? `${site.name[lang]} · ${d.name[lang]}` : `${site.name[lang]}, ${site.area[lang]}`;
  const hasValve = d.valve !== "none";

  return (
    <div className="alarm" role="alertdialog" aria-modal="true" aria-labelledby="alarm-title" tabIndex={-1} ref={ref}>
      <div className="alarm-inner">
        <span className="alarm-icon"><Icon name="flame" size={40} /></span>
        <h2 id="alarm-title">{t("alarmTitle", { name: place })}</h2>
        <ul className="alarm-facts">
          <li><Icon name={hasValve ? "check" : "alert"} size={20} />{hasValve ? t("alarmValve") : t("alarmNoValve")}</li>
          <li><Icon name="check" size={20} />{t("alarmFan")}</li>
          {mode === "demo" && <li><Icon name={family.length ? "check" : "users"} size={20} />{family.length ? t("alarmSms", { n: family.length }) : t("alarmNoFamily")}</li>}
        </ul>
        <p className="alarm-do">{t("alarmDo")}</p>
        <div className="alarm-actions">
          <button type="button" className="btn btn--light btn--block" onClick={() => { actions.closeAlarm(); go({ name: "device", id: d.id }); }}>{t("seeKitchen")}</button>
          {family[0] && <a className="btn btn--outline-light btn--block" href={`tel:${family[0].phone}`}><Icon name="phone" size={18} />{t("callFamily")}</a>}
          <button type="button" className="btn btn--text-light" onClick={actions.mute}><Icon name="mute" size={18} />{t("mute")}</button>
        </div>
      </div>
    </div>
  );
}
