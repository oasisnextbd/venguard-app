import { THRESHOLD } from "../lib/sim";

/** Gas history line (last 60 s). Scale 0–40 % LEL; the dashed line is the alarm threshold. */
export function Sparkline({ values, height = 36 }: { values: number[]; height?: number }) {
  const w = 120;
  const max = 40;
  const y = (v: number) => height - (Math.min(v, max) / max) * (height - 2) - 1;
  const pts = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * w},${y(v).toFixed(1)}`).join(" ");
  const hot = values.some((v) => v >= THRESHOLD);
  return (
    <svg className={`spark${hot ? " spark--hot" : ""}`} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" x2={w} y1={y(THRESHOLD)} y2={y(THRESHOLD)} className="spark-threshold" />
      <polyline points={pts} fill="none" />
    </svg>
  );
}

/** Semicircle gauge for the gas level, with the threshold marked. */
export function Gauge({ value, label }: { value: number; label: string }) {
  const max = 50;
  const r = 80;
  const c = Math.PI * r;
  const frac = Math.min(value, max) / max;
  const th = THRESHOLD / max;
  const angle = Math.PI * (1 - th);
  const tx = 100 + Math.cos(angle) * r;
  const ty = 100 - Math.sin(angle) * r;
  const level = value >= THRESHOLD ? "hot" : value >= THRESHOLD / 2 ? "warm" : "ok";
  return (
    <svg className={`gauge gauge--${level}`} viewBox="0 0 200 116" role="img" aria-label={label}>
      <path d="M20 100a80 80 0 0 1 160 0" className="gauge-track" />
      <path d="M20 100a80 80 0 0 1 160 0" className="gauge-value" strokeDasharray={`${c * frac} ${c}`} />
      <line x1={tx} y1={ty} x2={100 + Math.cos(angle) * (r - 18)} y2={100 - Math.sin(angle) * (r - 18)} className="gauge-mark" />
    </svg>
  );
}
