/**
 * VenGuard logo (Logo Guidelines v1.0, in the website repo: docs/venguard/VenGuard_Logo_Guidelines.docx).
 * Primary full-colour lockup on light, reversed lockup (white shield and wordmark, orange stripes) on dark;
 * CSS shows one of the two from the theme. Files: public/brand/ (named as in the guide; replace them with the
 * designer's vector master when it exists). The lockup is about 3.86 : 1; keep it at least 120 px wide (31 px tall).
 */
const BASE = import.meta.env.BASE_URL;

export function Logo({ height = 31 }: { height?: number }) {
  const width = Math.round(height * 3.863);
  return (
    <span className="logo" role="img" aria-label="VenGuard">
      <img className="logo-img logo-img--light" src={`${BASE}brand/VenGuard_Logo_Primary_FullColour_RGB.svg`} width={width} height={height} alt="" />
      <img className="logo-img logo-img--dark" src={`${BASE}brand/VenGuard_Logo_Primary_Reversed_RGB.svg`} width={width} height={height} alt="" />
    </span>
  );
}
