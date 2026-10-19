/**
 * Android app: History. Every event from every device, newest first, as a timeline; each card names
 * the device (place · device) so people can tell them apart.
 */
import { EVENT_ICON } from "../components/EventList";
import { Icon } from "../components/Icon";
import { clock } from "../lib/i18n";
import type { EventType } from "../lib/sim";
import { useApp } from "../lib/store";
import { useT } from "../lib/useT";

/** Dot and icon colour per event: red for a leak, yellow for things to look at, green when it is over. */
const TONE: Record<EventType, "danger" | "caution" | "safe" | "neutral"> = {
  leak_confirmed: "danger",
  tamper: "danger",
  valve_closed: "caution",
  remote_close: "caution",
  regulator_off: "caution",
  battery_low: "caution",
  fan_on: "neutral",
  fan_off: "neutral",
  test: "neutral",
  air_clear: "safe",
  reset: "safe",
};

export function History() {
  const { events, devices, sites } = useApp();
  const { t, n, lang } = useT();
  const day = (at: number) => {
    const s = new Date(at).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
    return s;
  };

  return (
    <main className="page">
      <h1 className="page-title">{t("tabHistory")}</h1>
      <section className="phist-banner">
        <span className="phist-banner-icon"><Icon name="bell" size={26} /></span>
        <span><strong>{t("activityTitle")}</strong><span>{t("activityCount", { n: events.length })}</span></span>
      </section>

      {events.length === 0 ? <p className="empty">{t("alertsEmpty")}</p> : (
        <>
          <h2 className="phist-h2">{t("recentActivity")}</h2>
          <ol className="phist">
            {events.map((e) => {
              const d = devices[e.deviceId];
              const s = d && sites.find((x) => x.id === d.siteId);
              const place = d ? (s ? `${s.name[lang]} · ${d.name[lang]}` : d.name[lang]) : e.deviceId;
              return (
                <li key={e.id} className={`phist-item phist-item--${TONE[e.type]}`}>
                  <span className="phist-dot" aria-hidden="true" />
                  <a className="phist-card" href={d ? `#/device/${encodeURIComponent(d.id)}` : undefined}>
                    <span className="phist-icon"><Icon name={EVENT_ICON[e.type]} /></span>
                    <span className="phist-text">
                      <strong>{place}</strong>
                      <span>{t(`ev_${e.type}`)}</span>
                      <time dateTime={new Date(e.at).toISOString()}>{clock(e.at, lang)} · {n(day(e.at))}</time>
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </main>
  );
}
