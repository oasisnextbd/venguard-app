/** Android app: every device's readings (gas, valve, fan, battery); tap one for its full screen. */
import { Icon } from "../components/Icon";
import { DEMO_DEVICE } from "../lib/demo";
import { actions, useApp } from "../lib/store";
import { useT } from "../lib/useT";
import { KitchenCard } from "../screens/Home";

export function Details() {
  const { devices, sites, mode } = useApp();
  const { t, lang } = useT();
  const list = Object.values(devices);
  const demo = devices[DEMO_DEVICE];
  const demoReady = mode === "demo" && demo && !demo.leaking && !demo.alarm && demo.valve !== "closed";

  return (
    <main className="page">
      <h1 className="page-title">{t("tabDetails")}</h1>
      <p className="muted">{list.length ? t("detailsLead") : t("noDevicesLead")}</p>
      {demoReady && (
        <button type="button" className="demo-cta" onClick={() => actions.leak()}>
          <Icon name="play" size={20} />
          <span><strong>{t("tryLeak")}</strong><span className="small">{t("tryLeakSub")}</span></span>
        </button>
      )}
      <div className="cards">
        {list.map((d) => {
          const s = sites.find((x) => x.id === d.siteId);
          return <KitchenCard key={d.id} device={d} title={s ? `${s.name[lang]} · ${d.name[lang]}` : d.name[lang]} sub={s ? s.area[lang] : ""} />;
        })}
      </div>
    </main>
  );
}
