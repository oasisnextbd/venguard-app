/** VenGuard logo: the orange wave and the bar (bar takes the text colour). */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size * 1.2} height={size} viewBox="0 0 120 100" aria-hidden="true" focusable="false">
      <path d="M11 63C11 48 22 41 32 43c11 2 14 20 27 20 8 0 13-5 18-10" fill="none" stroke="var(--orange)" strokeWidth="15" strokeLinecap="round" />
      <path d="M103 14v72" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-word">VenGuard</span>
    </span>
  );
}
