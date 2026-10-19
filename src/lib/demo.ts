import { type AppEvent, HISTORY, type Device, type Site } from "./sim";

/** Demo sites and devices. Chosen to show every state the app can display. */
export const SITES: Site[] = [
  { id: "home", kind: "home", name: { bn: "বাসা", en: "Home" }, area: { bn: "মিরপুর ১১", en: "Mirpur 11" } },
  { id: "mother", kind: "home", name: { bn: "মায়ের ফ্ল্যাট", en: "Mother's flat" }, area: { bn: "ধানমন্ডি", en: "Dhanmondi" } },
  { id: "tower", kind: "building", name: { bn: "রোজ ভিউ টাওয়ার", en: "Rose View Tower" }, area: { bn: "উত্তরা", en: "Uttara" } },
];

function device(id: string, siteId: string, bn: string, en: string, extra: Partial<Device> = {}): Device {
  const gas = 2 + Math.random() * 1.5;
  return {
    id,
    siteId,
    name: { bn, en },
    kit: "complete",
    gas,
    history: Array.from({ length: HISTORY }, () => Math.round((1.5 + Math.random() * 2) * 10) / 10),
    valve: "open",
    fan: false,
    battery: 70 + Math.round(Math.random() * 28),
    online: true,
    leaking: false,
    confirm: 0,
    alarm: false,
    ...extra,
  };
}

const BN = "০১২৩৪৫৬৭৮৯";
const bnNum = (n: number) => String(n).replace(/[0-9]/g, (d) => BN[Number(d)]);

export function seedDevices(): Record<string, Device> {
  const list: Device[] = [
    device("home-kitchen", "home", "রান্নাঘর", "Kitchen", { battery: 78 }),
    device("mother-kitchen", "mother", "রান্নাঘর", "Kitchen", { kit: "detector_relay", valve: "none", battery: 14 }),
  ];
  const floors = [1, 2, 3, 4, 5, 6];
  for (const f of floors) {
    for (const u of ["A", "B"]) {
      const id = `tower-${f}${u}`;
      const extra: Partial<Device> = {};
      if (id === "tower-3B") extra.online = false;
      if (id === "tower-5A") extra.battery = 11;
      list.push(device(id, "tower", `ফ্ল্যাট ${bnNum(f)}${u}`, `Flat ${f}${u}`, extra));
    }
  }
  return Object.fromEntries(list.map((d) => [d.id, d]));
}

/** The device the "trigger a leak" demo button uses. */
export const DEMO_DEVICE = "home-kitchen";

/*
 * Phone layout (Android app): five places, one device each, so the home screen shows its device panels.
 * Made-up places; three are safe, one has a low battery and one is offline.
 */
export const PHONE_SITES: Site[] = [
  SITES[0],
  SITES[1],
  { id: "office", kind: "home", name: { bn: "অফিস", en: "Office" }, area: { bn: "গুলশান ২", en: "Gulshan 2" } },
  { id: "restaurant", kind: "home", name: { bn: "রেস্টুরেন্ট", en: "Restaurant" }, area: { bn: "বনানী", en: "Banani" } },
  SITES[2],
];

export function seedPhoneDevices(): Record<string, Device> {
  const list: Device[] = [
    device("home-kitchen", "home", "রান্নাঘর", "Kitchen", { battery: 78 }),
    device("mother-kitchen", "mother", "রান্নাঘর", "Kitchen", { kit: "detector_relay", valve: "none", battery: 14 }),
    device("office-pantry", "office", "প্যান্ট্রি", "Pantry"),
    device("restaurant-kitchen", "restaurant", "মূল রান্নাঘর", "Main kitchen"),
    device("tower-3B", "tower", `ফ্ল্যাট ${bnNum(3)}B`, "Flat 3B", { online: false }),
  ];
  return Object.fromEntries(list.map((d) => [d.id, d]));
}

/** Phone demo: a week of made-up history so the History tab has something to show. Newest first. */
export function seedPhoneEvents(now = Date.now()): AppEvent[] {
  const DAY = 864e5;
  const at = (daysAgo: number, h: number, m: number) => {
    const d = new Date(now - daysAgo * DAY);
    d.setHours(h, m, 0, 0);
    return d.getTime();
  };
  const ev = (deviceId: string, type: AppEvent["type"], t: number): AppEvent => ({ id: `seed-${deviceId}-${type}-${t}`, at: t, deviceId, type });
  const list: AppEvent[] = [
    ev("mother-kitchen", "battery_low", at(1, 9, 5)),
    ev("restaurant-kitchen", "leak_confirmed", at(2, 20, 14)),
    ev("restaurant-kitchen", "valve_closed", at(2, 20, 14) + 1000),
    ev("restaurant-kitchen", "fan_on", at(2, 20, 14) + 2000),
    ev("restaurant-kitchen", "air_clear", at(2, 20, 19)),
    ev("restaurant-kitchen", "fan_off", at(2, 20, 19) + 1000),
    ev("restaurant-kitchen", "reset", at(2, 20, 41)),
    ev("home-kitchen", "test", at(3, 10, 2)),
    ev("office-pantry", "remote_close", at(5, 18, 40)),
    ev("office-pantry", "reset", at(5, 19, 2)),
  ];
  return list.sort((a, b) => b.at - a.at);
}
