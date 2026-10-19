import { EventList } from "../components/EventList";
import { useApp } from "../lib/store";
import { useT } from "../lib/useT";

export function Alerts() {
  const { events } = useApp();
  const { t } = useT();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const today = events.filter((e) => e.at >= start.getTime());
  const earlier = events.filter((e) => e.at < start.getTime());
  return (
    <main className="page">
      <h1 className="page-title">{t("tabAlerts")}</h1>
      {events.length === 0 && <p className="empty">{t("alertsEmpty")}</p>}
      {today.length > 0 && (<><h2 className="section-title">{t("today")}</h2><section className="panel"><EventList events={today} showPlace /></section></>)}
      {earlier.length > 0 && (<><h2 className="section-title">{t("earlier")}</h2><section className="panel"><EventList events={earlier} showPlace /></section></>)}
    </main>
  );
}
