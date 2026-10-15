import { Gauge } from "../components/Charts";
import { EventList } from "../components/EventList";
import { Icon } from "../components/Icon";
import { StatusPill, longKey } from "../components/Status";
import { CONFIRM_SECONDS, THRESHOLD, canReset, statusOf } from "../lib/sim";
import { actions, useApp } from "../lib/store";
import { useT } from "../lib/useT";

export function DeviceScreen({ id }: { id: string }) {
  const { devices, sites, events, mode, closeReq } = useApp();
  const { t, n, lang } = useT();
  const d = devices[id];
  if (!d) return <main className="page"><p>404</p></main>;
  const site = sites.find((s) => s.id === d.siteId)!;
  const status = statusOf(d);
  const hasValve = d.valve !== "none";
  const valveWord = t(d.valve === "none" ? "noValve" : d.valve);
  const mine = events.filter((e) => e.deviceId === id).slice(0, 20);
  const backHref = site.kind === "building" ? `#/site/${site.id}` : "#/";
  const title = site.kind === "building" ? `${d.name[lang]} · ${site.name[lang]}` : site.name[lang];

  return (
    <main className="page">
      <a className="back" href={backHref}><Icon name="back" size={20} />{t("back")}</a>
      <header className="device-head">
        <div>
          <h1>{title}</h1>
          <p className="muted">{site.area[lang]} · {t(d.kit === "complete" ? "kitComplete" : "kitDetectorRelay")}</p>
        </div>
        <StatusPill status={status} />
      </header>

      <section className={`panel panel--${status} gauge-panel`} aria-live="polite">
        <Gauge value={d.gas} label={`${t("gas")} ${n(Math.round(d.gas))}${t("lel")}`} />
        <div className="gauge-readout">
          <span className="gauge-number">{n(Math.round(d.gas))}</span>
          <span className="gauge-unit">{t("lel")}</span>
          <span className="small muted">{t("alarmAt", { n: THRESHOLD })}</span>
        </div>
        <p className="status-line">
          {t(longKey(status, hasValve))}
          {status === "checking" && <strong> {t("seconds", { n: Math.max(0, CONFIRM_SECONDS - d.confirm) })}</strong>}
        </p>
      </section>

      <section className="panel">
        <h2 className="panel-title">{t("chain")}</h2>
        <ol className="chain">
          <li className={d.alarm || d.confirm > 0 ? "is-hot" : "is-ok"}>
            <Icon name="sense" /><strong>{t("chainDetector")}</strong>
            <span>{d.alarm ? t("leakFound") : d.confirm > 0 ? t("st_checking") : t("watching")}</span>
          </li>
          <li className={d.fan ? "is-active" : "is-ok"}>
            <Icon name="fan" className={d.fan ? "spin" : ""} /><strong>{t("chainRelay")}</strong>
            <span>{d.fan ? t("running") : t("standby")}</span>
          </li>
          <li className={!hasValve ? "is-missing" : d.valve === "closed" ? "is-active" : "is-ok"}>
            <Icon name="valve" /><strong>{t("chainValve")}</strong>
            <span>{valveWord}</span>
          </li>
        </ol>
        {!hasValve && <p className="small note">{t("addValve")}</p>}
      </section>

      <div className="tiles">
        <div className="tile"><span className="reading-label">{t("valve")}</span><strong>{valveWord}</strong></div>
        <div className="tile"><span className="reading-label">{t("fan")}</span><strong>{t(d.fan ? "on" : "off")}</strong></div>
        <div className="tile"><span className="reading-label">{t("battery")}</span><strong>{d.battery === null ? "—" : `${n(d.battery)}%`}</strong></div>
      </div>

      {hasValve && d.valve === "open" && (
        <section className="panel">
          {d.online ? (
            <>
              <button type="button" className="btn btn--danger btn--block" disabled={closeReq[id] === "sent"} onClick={() => actions.remoteClose(id)}>
                <Icon name="valve" />{t("closeNow")}
              </button>
              <p className="small muted mt">{t("closeNowSub")}</p>
            </>
          ) : (
            <p className="small muted">{t("offlineNoClose")}</p>
          )}
          {closeReq[id] === "sent" && <p className="small mt" role="status">{t("closeSent")}</p>}
          {closeReq[id] === "failed" && <p className="error mt" role="alert">{t("closeFailed")}</p>}
        </section>
      )}
      {d.valve === "closed" && (closeReq[id] === "closed" || closeReq[id] === "already_closed") && <p className="small" role="status">{t("closeDone")}</p>}

      {d.valve === "closed" && (
        <section className="panel">
          <h2 className="panel-title">{t("resetTitle")}</h2>
          <ol className="steps">
            <li>{t("reset1")}</li>
            <li>{t("reset2")}</li>
            <li>{t("reset3")}</li>
          </ol>
          {mode === "live" ? null : canReset(d)
            ? <button type="button" className="btn btn--secondary btn--block demo-btn" onClick={() => actions.reset(id)}><Icon name="lever" />{t("demoReset")}</button>
            : <p className="small muted">{t("resetWait")}</p>}
        </section>
      )}

      {mode === "demo" && d.online && (
        <div className="demo-actions">
          {!d.leaking && !d.alarm && d.valve !== "closed" && (
            <button type="button" className="btn btn--ghost demo-btn" onClick={() => actions.leak(id)}><Icon name="play" size={18} />{t("demoLeak")}</button>
          )}
          {!hasValve && d.leaking && (
            <button type="button" className="btn btn--ghost demo-btn" onClick={() => actions.regulatorOff(id)}><Icon name="valve" size={18} />{t("demoRegulator")}</button>
          )}
        </div>
      )}

      <section className="panel">
        <h2 className="panel-title">{t("history")}</h2>
        {mine.length ? <EventList events={mine} /> : <p className="muted small">{t("noEvents")}</p>}
      </section>
    </main>
  );
}
