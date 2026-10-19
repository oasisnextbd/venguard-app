/**
 * Android app: one device (opened from its panel on Home). Laid out like a router app's device page:
 * a header band with the photo and place, the gas bar (LFL and HFL marked, green → yellow → red as gas rises),
 * battery and connection, then the three parts (detector, valve, relay) with their condition.
 * The app can close the gas remotely but never open it (DeviceActions).
 */
import { EventList } from "../components/EventList";
import { Icon } from "../components/Icon";
import { StatusPill, longKey } from "../components/Status";
import {
  BAR_HFL,
  BAR_LFL,
  BATTERY_LOW,
  CONFIRM_SECONDS,
  THRESHOLD,
  type Device,
  barPosition,
  gasColour,
  statusOf,
  toVolume,
} from "../lib/sim";
import { useApp } from "../lib/store";
import { useT } from "../lib/useT";
import { DeviceActions } from "../screens/Device";

const BASE = import.meta.env.BASE_URL;
const PHOTO = { detector: "devices/detector.webp", valve: "devices/valve.webp", relay: "devices/relay.webp" };

export function PhoneDevice({ id }: { id: string }) {
  const { devices, sites, events, mode } = useApp();
  const { t, n, lang } = useT();
  const d = devices[id];
  if (!d) return <main className="page"><a className="back" href="#/"><Icon name="back" size={20} />{t("back")}</a><p className="muted">{mode === "live" ? t("loading") : t("noEvents")}</p></main>;
  const site = sites.find((s) => s.id === d.siteId);
  const status = statusOf(d);
  const mine = events.filter((e) => e.deviceId === id).slice(0, 5);

  return (
    <main className="pdev">
      <header className="pdev-hero">
        <a className="pdev-back" href="#/" aria-label={t("back")}><Icon name="back" size={26} /></a>
        <div className="pdev-hero-row">
          <img className="pdev-photo" src={`${BASE}${PHOTO.detector}`} width={92} height={138} alt="" />
          <div className="pdev-title">
            <h1>{site ? site.name[lang] : d.name[lang]}</h1>
            <p>{d.name[lang]}{site ? ` · ${site.area[lang]}` : ""}</p>
            <p className="pdev-kit">{t(d.kit === "complete" ? "kitComplete" : "kitDetectorRelay")}</p>
            <StatusPill status={status} />
          </div>
        </div>
      </header>

      <div className="pdev-body">
        <GasCard device={d} />

        <section className="pdev-stats">
          <div>
            <span className="pdev-stat-value"><Icon name="battery" />{d.battery === null ? "—" : `${n(d.battery)}%`}</span>
            <span className="pdev-stat-label">{t("battery")} · {d.battery !== null && d.battery < BATTERY_LOW ? t("st_battery") : t("batteryGood")}</span>
          </div>
          <div>
            <span className="pdev-stat-value"><Icon name={d.online ? "check" : "wifiOff"} />{d.online ? t("online") : t("st_offline")}</span>
            <span className="pdev-stat-label">{t("connection")}</span>
          </div>
        </section>

        <h2 className="pdev-h2">{t("parts")} ({n(d.valve === "none" ? 2 : 3)})</h2>
        <section className="pdev-parts">
          <Part photo={PHOTO.detector} name={t("chainDetector")} hot={d.alarm || d.confirm > 0}
            line={!d.online ? t("noData") : `${t("sensor")}: ${d.alarm ? t("leakFound") : d.confirm > 0 ? t("st_checking") : t("watching")}`}
            state={!d.online ? "off" : d.alarm ? "danger" : d.confirm > 0 ? "caution" : "ok"} />
          {d.valve !== "none" ? (
            <Part photo={PHOTO.valve} name={t("chainValve")} hot={false}
              line={!d.online ? t("noData") : `${t(d.valve)} · ${t(d.valve === "open" ? "gasFlowing" : "gasShut")}`}
              state={!d.online ? "off" : d.valve === "closed" ? "caution" : "ok"} />
          ) : (
            <Part photo={PHOTO.valve} name={t("chainValve")} hot={false} line={t("addValve")} state="missing" />
          )}
          <Part photo={PHOTO.relay} name={t("chainRelay")} hot={false}
            line={!d.online ? t("noData") : `${t("fan")}: ${d.fan ? t("running") : t("standby")}`}
            state={!d.online ? "off" : d.fan ? "active" : "ok"} spin={d.fan} />
        </section>

        <DeviceActions id={id} />

        <h2 className="pdev-h2">{t("history")}</h2>
        <section className="panel">
          {mine.length ? <EventList events={mine} /> : <p className="muted small">{t("noEvents")}</p>}
          {mine.length > 0 && <a className="arrow-link mt" href="#/alerts">{t("seeAllHistory")}<Icon name="chevron" size={18} /></a>}
        </section>

        <p className="small muted center">{t("deviceIdLabel", { id: d.id })}</p>
      </div>
    </main>
  );
}

/** The gas bar: fill up to the current level, coloured from green to red; alarm, LFL and HFL marked. */
function GasCard({ device: d }: { device: Device }) {
  const { t, n } = useT();
  const status = statusOf(d);
  const pos = barPosition(d.gas);
  const colour = gasColour(d.gas);
  const vol = toVolume(d.gas);
  const pct = (x: number) => `${(x * 100).toFixed(2)}%`;
  return (
    <section className={`pdev-gas pdev-gas--${status}`} aria-live="polite">
      <div className="pdev-gas-top">
        <span className="pdev-gas-number" style={{ color: d.online ? colour : undefined }}>{d.online ? n(Math.round(d.gas)) : "—"}<small>{t("lel")}</small></span>
        <span className="pdev-gas-label">{t("gasLevel")}</span>
      </div>
      <div className="gasbar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(d.gas)} aria-label={`${t("gasLevel")}: ${n(Math.round(d.gas))}${t("lel")}`}>
        <div className="gasbar-track">
          <span className="gasbar-zone" style={{ left: pct(BAR_LFL), width: pct(BAR_HFL - BAR_LFL) }} />
          {d.online && <span className="gasbar-fill" style={{ width: pct(Math.max(pos, 0.015)), background: colour }} />}
        </div>
        <span className="gasbar-mark gasbar-mark--alarm" style={{ left: pct(barPosition(THRESHOLD)) }}><i />{t("alarmMark")}</span>
        <span className="gasbar-mark" style={{ left: pct(BAR_LFL) }}><i />LFL</span>
        <span className="gasbar-mark" style={{ left: pct(BAR_HFL) }}><i />HFL</span>
      </div>
      <p className="pdev-gas-line">
        {t(longKey(status, d.valve !== "none"))}
        {status === "checking" && <strong> {t("seconds", { n: Math.max(0, CONFIRM_SECONDS - d.confirm) })}</strong>}
      </p>
      {d.online && <p className="small muted">{t("inAir", { v: n(vol < 0.1 ? vol.toFixed(2) : vol.toFixed(1)) })}</p>}
      <p className="small muted">{t("lflNote", { n: THRESHOLD })}</p>
    </section>
  );
}

function Part({ photo, name, line, state, hot, spin = false }: {
  photo: string; name: string; line: string; state: "ok" | "caution" | "danger" | "active" | "off" | "missing"; hot: boolean; spin?: boolean;
}) {
  return (
    <div className={`pdev-part pdev-part--${state}${hot ? " is-hot" : ""}`}>
      <img src={`${BASE}${photo}`} width={64} height={64} alt="" />
      <span className="pdev-part-text"><strong>{name}</strong><span>{line}</span></span>
      <span className="pdev-part-dot" aria-hidden="true">{state === "active" && <Icon name="fan" size={18} className={spin ? "spin" : ""} />}</span>
    </div>
  );
}
