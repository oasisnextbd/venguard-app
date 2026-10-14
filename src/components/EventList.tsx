import { Icon, type IconName } from "./Icon";
import { clock } from "../lib/i18n";
import type { AppEvent, EventType } from "../lib/sim";
import { useApp } from "../lib/store";
import { useT } from "../lib/useT";

const EVENT_ICON: Record<EventType, IconName> = {
  leak_confirmed: "flame",
  valve_closed: "valve",
  fan_on: "fan",
  fan_off: "fan",
  air_clear: "check",
  reset: "lever",
  remote_close: "valve",
  regulator_off: "valve",
};

const URGENT: EventType[] = ["leak_confirmed"];

/** Timeline of events, newest first. `showPlace` adds the kitchen name (Alerts tab). */
export function EventList({ events, showPlace = false }: { events: AppEvent[]; showPlace?: boolean }) {
  const { devices, sites } = useApp();
  const { t, lang } = useT();
  return (
    <ol className="events">
      {events.map((e) => {
        const d = devices[e.deviceId];
        const site = d && sites.find((s) => s.id === d.siteId);
        return (
          <li key={e.id} className={URGENT.includes(e.type) ? "is-urgent" : ""}>
            <span className="event-icon"><Icon name={EVENT_ICON[e.type]} size={18} /></span>
            <span className="event-text">
              <strong>{t(`ev_${e.type}`)}</strong>
              {showPlace && site && <span>{site.name[lang]}{site.kind === "building" ? ` · ${d.name[lang]}` : ""}</span>}
            </span>
            <time dateTime={new Date(e.at).toISOString()}>{clock(e.at, lang)}</time>
          </li>
        );
      })}
    </ol>
  );
}
