/**
 * How a device's place is written: "Home · Kitchen" when the place and the device have different names;
 * when they share one name it is not repeated ("Home", with the area "Mirpur 11" underneath).
 */
import type { Lang } from "./i18n";
import type { Device, Site } from "./sim";

/** "Home · Kitchen", or just "Home" when the device is named like its place. */
export function placeName(d: Device, site: Site | undefined, lang: Lang): string {
  if (!site) return d.name[lang];
  return site.name[lang] === d.name[lang] ? site.name[lang] : `${site.name[lang]} · ${d.name[lang]}`;
}

/** The line under the place: "Kitchen · Mirpur 11", or just the area. */
export function placeDetail(d: Device, site: Site | undefined, lang: Lang): string {
  if (!site) return "";
  const room = site.name[lang] === d.name[lang] ? "" : d.name[lang];
  return [room, site.area[lang]].filter(Boolean).join(" · ");
}
