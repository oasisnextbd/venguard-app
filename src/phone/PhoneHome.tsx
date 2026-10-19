/**
 * Android app home: one panel per device on this account, with its place and one reading (its status).
 * The panel's border shows the status colour: green when there is no gas leak.
 * Sizes: one device fills the screen; up to four fit on screen (two by two); more scroll.
 * + adds a device with the ID and code on its sticker (screens/AddDevice.tsx); Edit removes one from
 * this account (the device keeps working and can be added again).
 */
import { useState } from "react";
import { Icon } from "../components/Icon";
import { STATUS_ICON } from "../components/Status";
import { placeDetail, placeName } from "../lib/place";
import { href } from "../lib/router";
import { type Device, type Site, statusOf } from "../lib/sim";
import { actions, useApp } from "../lib/store";
import { useT } from "../lib/useT";

export function PhoneHome() {
  const { devices, sites } = useApp();
  const { t, n } = useT();
  const [editing, setEditing] = useState(false);
  const [asking, setAsking] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const list = Object.values(devices);
  const siteOf = (d: Device) => sites.find((s) => s.id === d.siteId);

  const remove = async (id: string) => {
    setBusy(true);
    setFailed(false);
    try {
      await actions.removeDevice(id);
      setAsking(null);
      if (list.length === 1) setEditing(false);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="phome">
      <div className="phome-head">
        <h1>{t("myDevices")} <span className="phome-count">{n(list.length)}</span></h1>
        {list.length > 0 && (
          <button type="button" className="chip-btn" aria-pressed={editing} onClick={() => { setEditing(!editing); setAsking(null); setFailed(false); }}>
            {editing ? t("done") : t("edit")}
          </button>
        )}
        <a className="icon-btn" href="#/add" aria-label={t("addDeviceTitle")} title={t("addDeviceTitle")}><Icon name="plus" size={20} /></a>
      </div>

      {list.length === 0 ? (
        <section className="dev-empty">
          <span className="hero-icon"><Icon name="shield" size={28} /></span>
          <h2>{t("noDevicesTitle")}</h2>
          <p className="muted">{t("noDevicesLead")}</p>
          <a className="btn btn--primary" href="#/add"><Icon name="plus" size={18} />{t("addDeviceTitle")}</a>
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
              busy={busy}
              failed={failed && asking === d.id}
              onAsk={() => { setAsking(d.id); setFailed(false); }}
              onCancel={() => setAsking(null)}
              onRemove={() => void remove(d.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function DevicePanel({ device: d, site, wide, editing, asking, busy, failed, onAsk, onCancel, onRemove }: {
  device: Device; site: Site | undefined; wide: boolean; editing: boolean; asking: boolean; busy: boolean; failed: boolean;
  onAsk: () => void; onCancel: () => void; onRemove: () => void;
}) {
  const { t, lang } = useT();
  const status = statusOf(d);
  const name = placeName(d, site, lang);
  const detail = placeDetail(d, site, lang);
  const body = (
    <>
      <span className="dev-loc">
        <Icon name="pin" size={18} />
        <span><strong>{name}</strong>{detail && <span>{detail}</span>}</span>
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
        <button type="button" className="dev-x" onClick={onAsk} aria-label={t("removeThis", { name })}>
          <Icon name="x" size={18} />
        </button>
      )}
      {asking && (
        <div className="dev-ask" role="alertdialog" aria-label={t("removeAsk", { name })}>
          <strong>{t("removeAsk", { name })}</strong>
          <span className="small muted">{t("removeNote")}</span>
          {failed && <span className="small error" role="alert">{t("removeFailed")}</span>}
          <button type="button" className="btn btn--danger btn--sm" disabled={busy} onClick={onRemove}>{busy ? t("loading") : t("remove")}</button>
          <button type="button" className="btn btn--secondary btn--sm" disabled={busy} onClick={onCancel}>{t("cancel")}</button>
        </div>
      )}
    </div>
  );
}
