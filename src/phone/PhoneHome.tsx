/**
 * Android app home: one panel per device, with its place and one reading (its status).
 * The panel's border shows the status colour: green when there is no gas leak.
 * Sizes: one device fills the screen; up to four fit on screen (two by two); more scroll.
 * Demo: Edit removes a device, + adds it back. Live: + adds a real device (removing comes later).
 */
import { useState } from "react";
import { Icon } from "../components/Icon";
import { STATUS_ICON } from "../components/Status";
import { go, href } from "../lib/router";
import { type Device, type Site, statusOf } from "../lib/sim";
import { actions, useApp } from "../lib/store";
import { useT } from "../lib/useT";

export function PhoneHome() {
  const { devices, sites, mode, removed } = useApp();
  const { t, n, lang } = useT();
  const [editing, setEditing] = useState(false);
  const [asking, setAsking] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const list = Object.values(devices);
  const siteOf = (d: Device) => sites.find((s) => s.id === d.siteId);

  const add = () => (mode === "live" ? go({ name: "add" }) : setAdding(true));

  return (
    <main className="phome">
      <div className="phome-head">
        <h1>{t("myDevices")} <span className="phome-count">{n(list.length)}</span></h1>
        {mode === "demo" && list.length > 0 && (
          <button type="button" className="chip-btn" aria-pressed={editing} onClick={() => { setEditing(!editing); setAsking(null); }}>
            {editing ? t("done") : t("edit")}
          </button>
        )}
        <button type="button" className="icon-btn" onClick={add} aria-label={mode === "live" ? t("addDeviceTitle") : t("addBackTitle")} title={mode === "live" ? t("addDeviceTitle") : t("addBackTitle")}>
          <Icon name="plus" size={20} />
        </button>
      </div>

      {list.length === 0 ? (
        <section className="dev-empty">
          <span className="hero-icon"><Icon name="shield" size={28} /></span>
          <h2>{t("noDevicesTitle")}</h2>
          <p className="muted">{mode === "live" ? t("noDevicesLead") : t("removeDemoNote")}</p>
          <button type="button" className="btn btn--primary" onClick={add}><Icon name="plus" size={18} />{mode === "live" ? t("addDeviceTitle") : t("addBackTitle")}</button>
        </section>
      ) : (
        <div className={`dev-grid dev-grid--${Math.min(list.length, 3)}`}>
          {list.map((d, i) => (
            <DevicePanel
              key={d.id}
              device={d}
              site={siteOf(d)}
              wide={list.length <= 2 || (list.length % 2 === 1 && i === list.length - 1)}
              editing={editing}
              asking={asking === d.id}
              onAsk={() => setAsking(d.id)}
              onCancel={() => setAsking(null)}
              onRemove={() => { actions.removeDevice(d.id); setAsking(null); if (list.length === 1) setEditing(false); }}
            />
          ))}
        </div>
      )}

      {adding && (
        <div className="psheet-backdrop" onClick={() => setAdding(false)}>
          <section className="psheet" role="dialog" aria-modal="true" aria-labelledby="addback-title" onClick={(e) => e.stopPropagation()}>
            <div className="psheet-head">
              <h2 id="addback-title">{t("addBackTitle")}</h2>
              <button type="button" className="icon-btn" onClick={() => setAdding(false)} aria-label={t("close")}><Icon name="x" size={20} /></button>
            </div>
            {removed.length === 0 ? <p className="muted">{t("addBackNone")}</p> : (
              <ul className="psheet-list">
                {removed.map((d) => {
                  const s = siteOf(d);
                  return (
                    <li key={d.id}>
                      <Icon name="pin" />
                      <span><strong>{s ? s.name[lang] : d.name[lang]}</strong><span className="small muted">{d.name[lang]}{s ? ` · ${s.area[lang]}` : ""}</span></span>
                      <button type="button" className="btn btn--primary btn--sm" onClick={() => { actions.restoreDevice(d.id); if (removed.length === 1) setAdding(false); }}>
                        <Icon name="plus" size={16} />{t("add")}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function DevicePanel({ device: d, site, wide, editing, asking, onAsk, onCancel, onRemove }: {
  device: Device; site: Site | undefined; wide: boolean; editing: boolean; asking: boolean;
  onAsk: () => void; onCancel: () => void; onRemove: () => void;
}) {
  const { t, lang } = useT();
  const status = statusOf(d);
  const place = site ? site.name[lang] : d.name[lang];
  const where = site ? `${d.name[lang]} · ${site.area[lang]}` : "";
  const body = (
    <>
      <span className="dev-loc">
        <Icon name="pin" size={18} />
        <span><strong>{place}</strong>{where && <span>{where}</span>}</span>
      </span>
      <span className="dev-state">
        <span className="dev-icon"><Icon name={STATUS_ICON[status]} /></span>
        <span className="dev-word">{t(`st_${status}`)}</span>
        <span className="dev-line">{t(`sh_${status}`)}</span>
      </span>
    </>
  );
  const cls = `dev-panel dev-panel--${status}${wide ? " dev-panel--wide" : ""}`;

  if (!editing) return <a className={cls} href={href({ name: "device", id: d.id })}>{body}</a>;
  return (
    <div className={`${cls} is-editing`}>
      {body}
      {!asking && (
        <button type="button" className="dev-x" onClick={onAsk} aria-label={t("removeThis", { name: `${place} · ${d.name[lang]}` })}>
          <Icon name="x" size={18} />
        </button>
      )}
      {asking && (
        <div className="dev-ask" role="alertdialog" aria-label={t("removeAsk", { name: `${place} · ${d.name[lang]}` })}>
          <strong>{t("removeAsk", { name: `${place} · ${d.name[lang]}` })}</strong>
          <span className="small muted">{t("removeDemoNote")}</span>
          <button type="button" className="btn btn--danger btn--sm" onClick={onRemove}>{t("remove")}</button>
          <button type="button" className="btn btn--secondary btn--sm" onClick={onCancel}>{t("cancel")}</button>
        </div>
      )}
    </div>
  );
}
