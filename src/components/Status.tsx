import type { Status } from "../lib/sim";
import { useT } from "../lib/useT";
import { Icon, type IconName } from "./Icon";

export const STATUS_ICON: Record<Status, IconName> = {
  danger: "flame",
  checking: "sense",
  gas_off: "valve",
  offline: "wifiOff",
  battery: "battery",
  safe: "shield",
};

/** Status chip: icon + word + colour (never colour alone). */
export function StatusPill({ status }: { status: Status }) {
  const { t } = useT();
  return (
    <span className={`pill pill--${status}`}>
      <Icon name={STATUS_ICON[status]} size={16} />
      {t(`st_${status}`)}
    </span>
  );
}

/** Translation key for the one-sentence explanation of a device's state. */
export function longKey(status: Status, hasValve: boolean) {
  if (status === "danger") return hasValve ? ("lg_danger_valve" as const) : ("lg_danger_novalve" as const);
  return `lg_${status}` as const;
}
