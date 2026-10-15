import { Sparkline } from "../components/Charts";
import { Icon } from "../components/Icon";
import { StatusPill, STATUS_ICON, longKey } from "../components/Status";
import { DEMO_DEVICE } from "../lib/demo";
import { href } from "../lib/router";
import { type Device, type Status, needsAttention, statusOf, worst } from "../lib/sim";
import { actions, useApp } from "../lib/store";
import { timeOfDay } from "../lib/i18n";
import { useT } from "../lib/useT";

export function Home() {
  const { sites, devices, mode } = useApp();
  const { t, n, lang } = useT();
  const all = Object.values(devices);
  const statuses = all.map(statusOf);
  const overall = worst(statuses);
  const count = statuses.filter(needsAttention).length;
  const urgent = all.find((d) => statusOf(d) === overall);
  const urgentSite = urgent && sites.find((s) => s.id === urgent.siteId);
  const demo = devices[DEMO_DEVICE];
  const demoBusy = !demo || demo.leaking || demo.alarm || demo.valve === "closed";
  const homes = sites.filter((s) => s.kind === "home");
  const buildings = sites.filter((s) => s.kind === "building");

  if (mode === "live" && all.length === 0) {
    return (
      <main className="page">
        <p className="greet">{timeOfDay(lang)}</p>
        <section className="panel empty-card">
          <span className="hero-icon"><Icon name="shield" size={28} /></span>
          <h1>{t("noDevicesTitle")}</h1>
          <p className="muted">{t("noDevicesLead")}</p>
          <a className="btn btn--primary" href="#/add"><Icon name="plus" size={18} />{t("addDeviceTitle")}</a>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="greet">{timeOfDay(lang)}</p>
      <section className={`hero hero--${overall}`} aria-live="polite">
        <span className="hero-icon"><Icon name={STATUS_ICON[overall]} size={28} /></span>
        <div>
          <h1>{count === 0 ? t("allSafe") : count === 1 ? t("oneAttention") : t("needAttention", { n: count })}</h1>
          <p>
            {count === 0 || !urgent || !urgentSite
              ? t("allSafeSub")
              : `${urgentSite.name[lang]}${urgentSite.kind === "building" ? ` · ${urgent.name[lang]}` : ""}: ${t(longKey(overall, urgent.valve !== "none"))}`}
          </p>
        </div>
      </section>

      {mode === "demo" && !demoBusy && (
        <button type="button" className="demo-cta" onClick={() => actions.leak()}>
          <Icon name="play" size={20} />
          <span><strong>{t("tryLeak")}</strong><span className="small">{t("tryLeakSub")}</span></span>
        </button>
      )}

      <h2 className="section-title">{t("kitchens")}</h2>
      <div className="cards">
        {homes.map((s) => {
          const d = all.find((x) => x.siteId === s.id)!;
          return <KitchenCard key={s.id} device={d} title={s.name[lang]} sub={s.area[lang]} />;
        })}
      </div>

      {buildings.length > 0 && <h2 className="section-title">{t("buildings")}</h2>}
      <div className="cards">
        {buildings.map((s) => {
          const units = all.filter((x) => x.siteId === s.id);
          const st = units.map(statusOf);
          const counts = st.reduce<Partial<Record<Status, number>>>((a, x) => ({ ...a, [x]: (a[x] || 0) + 1 }), {});
          return (
            <a key={s.id} className="card card--link" href={href({ name: "site", id: s.id })}>
              <div className="card-head">
                <span className="card-icon"><Icon name="building" /></span>
                <span className="card-title"><strong>{s.name[lang]}</strong><span>{t("units", { n: units.length })} · {s.area[lang]}</span></span>
                <StatusPill status={worst(st)} />
              </div>
              <div className="unit-dots" aria-hidden="true">{st.map((x, i) => <i key={i} className={`dot dot--${x}`} />)}</div>
              <ul className="legend">
                {(Object.keys(counts) as Status[]).map((k) => <li key={k}><i className={`dot dot--${k}`} />{n(counts[k]!)} {t(`st_${k}`)}</li>)}
              </ul>
            </a>
          );
        })}
      </div>
      {mode === "live" && <a className="arrow-link" href="#/add"><Icon name="plus" size={18} />{t("addAnother")}</a>}
    </main>
  );
}

export function KitchenCard({ device: d, title, sub }: { device: Device; title: string; sub: string }) {
  const { t, n } = useT();
  const status = statusOf(d);
  return (
    <a className={`card card--link card--${status}`} href={href({ name: "device", id: d.id })}>
      <div className="card-head">
        <span className={`card-icon card-icon--${status}`}><Icon name={STATUS_ICON[status]} /></span>
        <span className="card-title"><strong>{title}</strong><span>{sub}</span></span>
        <StatusPill status={status} />
      </div>
      <div className="readings">
        <div className="reading reading--gas">
          <span className="reading-label">{t("gas")}</span>
          <span className="reading-value">{n(Math.round(d.gas))}<small> {t("lel")}</small></span>
          <Sparkline values={d.history} />
        </div>
        <div className="reading">
          <span className="reading-label">{t("valve")}</span>
          <span className="reading-value">{d.valve === "none" ? t("noValve") : t(d.valve)}</span>
        </div>
        <div className="reading">
          <span className="reading-label">{t("fan")}</span>
          <span className={`reading-value${d.fan ? " is-on" : ""}`}>{t(d.fan ? "on" : "off")}</span>
        </div>
        <div className="reading">
          <span className="reading-label">{t("battery")}</span>
          <span className="reading-value">{d.battery === null ? "—" : `${n(d.battery)}%`}</span>
        </div>
      </div>
    </a>
  );
}
