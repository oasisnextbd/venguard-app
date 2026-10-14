/** Line icons (24px grid, 2px stroke, currentColor). */
const paths = {
  home: <><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z" /><path d="M10 21h4" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3 6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  shield: <><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  flame: <><path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5.5 1-8.5Z" /></>,
  valve: <><path d="M2 14h5M17 14h5" /><rect x="7" y="10" width="10" height="8" rx="1.5" /><path d="M12 10V6M8.5 4h7" /></>,
  fan: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="1.5" /><path d="M12 10.5c-.8-3 .6-5.5 3-6M13.4 12.6c3 .3 4.8 2.5 4.4 5M10.7 12.8c-2 2.2-4.8 2.4-6.6.8" /></>,
  sense: <><path d="M4 12c2-3 4-3 6 0s4 3 6 0 4-3 4-3" /><path d="M4 17c2-3 4-3 6 0s4 3 6 0" /><path d="M4 7c2-3 4-3 6 0s4 3 6 0" /></>,
  battery: <><rect x="3" y="7" width="16" height="10" rx="2" /><path d="M22 11v2M7 10v4" /></>,
  wifiOff: <><path d="M2 8.8a15 15 0 0 1 4.2-2.6M10 5.1A15 15 0 0 1 22 8.8M5 12.5a10 10 0 0 1 3.5-2M12 10a10 10 0 0 1 7 2.5M8.5 16.4a5 5 0 0 1 7 0" /><path d="M3 3l18 18" /></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M11 21v-3h2v3" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  back: <path d="m15 6-6 6 6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  alert: <><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17.5v.5" /></>,
  phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
  whatsapp: <><path d="M3.5 20.5 5 16.3A8.5 8.5 0 1 1 8 19.2l-4.5 1.3Z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2L9 8.5Z" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></>,
  volume: <><path d="M4 9v6h4l5 4V5L8 9H4Z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /></>,
  mute: <><path d="M4 9v6h4l5 4V5L8 9H4Z" /><path d="m16 9 5 6M21 9l-5 6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  play: <path d="M7 4v16l13-8L7 4Z" />,
  lever: <><path d="M5 19h14" /><path d="M8 19v-5h8v5" /><path d="m12 14 4-8" /><circle cx="16.5" cy="5" r="1.5" /></>,
  restart: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 22, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}
