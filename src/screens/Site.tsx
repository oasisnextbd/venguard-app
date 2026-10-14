import { Icon } from "../components/Icon";
import { StatusPill } from "../components/Status";
import { href } from "../lib/router";
import { statusOf, worst } from "../lib/sim";
import { useApp } from "../lib/store";
import { useT } from "../lib/useT";

/** A building: every flat's kitchen at a glance (landlord view). */
export function SiteScreen({ id }: { id: string }) {
  const { sites, devices } = useApp();
  const { t, n, lang } = useT();
  const site = sites.find((s) => s.id === id);
  if (!site) return <main className="page"><p>404</p></main>;
  const units = Object.values(devices).filter((d) => d.siteId === id);
  return (
    <main className="page">
      <a className="back" href="#/"><Icon name="back" size={20} />{t("back")}</a>
      <header className="device-head">
        <div>
          <h1>{site.name[lang]}</h1>
          <p className="muted">{t("units", { n: units.length })} · {site.area[lang]}</p>
        </div>
        <StatusPill status={worst(units.map(statusOf))} />
      </header>
      <ul className="unit-grid">
        {units.map((d) => {
          const s = statusOf(d);
          return (
            <li key={d.id}>
              <a className={`unit unit--${s}`} href={href({ name: "device", id: d.id })}>
                <strong>{d.name[lang]}</strong>
                <span className="unit-gas">{n(Math.round(d.gas))}<small>{t("lel")}</small></span>
                <span className="unit-status"><i className={`dot dot--${s}`} />{t(`st_${s}`)}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
