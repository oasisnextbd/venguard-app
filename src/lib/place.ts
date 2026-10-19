/**
 * How a device's place is written. Demo places have a place and a room ("Home" · "Kitchen");
 * a real device has one name and an area, so the name is not repeated ("Home", "Mirpur 11").
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
