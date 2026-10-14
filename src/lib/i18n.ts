/** All interface text, Bangla first. Keys are grouped by screen. */
export type Lang = "bn" | "en";

const dict = {
  // App frame
  demo: { bn: "ডেমো", en: "Demo" },
  demoNote: { bn: "এটি ডেমো: যন্ত্রগুলো সিমুলেটেড। আসল যন্ত্র পরের আপডেটে যুক্ত হবে।", en: "This is a demo with simulated devices. Real devices connect in a later update." },
  tabHome: { bn: "হোম", en: "Home" },
  tabAlerts: { bn: "সতর্কতা", en: "Alerts" },
  tabFamily: { bn: "পরিবার", en: "Family" },
  tabAccount: { bn: "অ্যাকাউন্ট", en: "Account" },
  back: { bn: "ফিরে যান", en: "Back" },

  // Welcome
  tagline: { bn: "নিজেই রক্ষা করে।", en: "Safety that acts." },
  welcomeLead: { bn: "গ্যাস লিক হলে VenGuard নিজেই ভালভ বন্ধ করে ও এগজস্ট ফ্যান চালু করে। এই অ্যাপে আপনি দূর থেকে সব দেখতে পান।", en: "When gas leaks, VenGuard closes the valve and starts the exhaust fan by itself. This app lets you see it all from anywhere." },
  startDemo: { bn: "ডেমো শুরু করুন", en: "Start the demo" },
  chooseLang: { bn: "ভাষা", en: "Language" },

  // Greeting / overview
  morning: { bn: "শুভ সকাল", en: "Good morning" },
  afternoon: { bn: "শুভ অপরাহ্ন", en: "Good afternoon" },
  evening: { bn: "শুভ সন্ধ্যা", en: "Good evening" },
  allSafe: { bn: "সব নিরাপদ", en: "All safe" },
  allSafeSub: { bn: "সব রান্নাঘরে গ্যাস স্বাভাবিক।", en: "Gas is normal in every kitchen." },
  needAttention: { bn: "{n}টি বিষয়ে নজর দিন", en: "{n} need attention" },
  oneAttention: { bn: "১টি বিষয়ে নজর দিন", en: "1 needs attention" },
  kitchens: { bn: "রান্নাঘর", en: "Kitchens" },
  buildings: { bn: "ভবন", en: "Buildings" },
  units: { bn: "{n}টি ইউনিট", en: "{n} units" },
  tryLeak: { bn: "ডেমো: একটি লিক ঘটিয়ে দেখুন", en: "Demo: trigger a leak and watch" },
  tryLeakSub: { bn: "বাসার রান্নাঘরে লিক শুরু হবে। ৭ সেকেন্ড পর VenGuard নিজেই কাজ করবে।", en: "Starts a leak in the Home kitchen. After 7 seconds VenGuard acts on its own." },

  // Status words (short and long)
  st_danger: { bn: "গ্যাস লিক", en: "Gas leak" },
  st_checking: { bn: "যাচাই হচ্ছে", en: "Checking" },
  st_gas_off: { bn: "গ্যাস বন্ধ", en: "Gas off" },
  st_offline: { bn: "অফলাইন", en: "Offline" },
  st_battery: { bn: "ব্যাটারি কম", en: "Battery low" },
  st_safe: { bn: "নিরাপদ", en: "Safe" },
  lg_danger_valve: { bn: "লিক নিশ্চিত। ভালভ নিজেই গ্যাস বন্ধ করেছে, ফ্যান গ্যাস বের করছে।", en: "Leak confirmed. The valve shut off the gas by itself and the fan is clearing the air." },
  lg_danger_novalve: { bn: "লিক নিশ্চিত। ফ্যান চলছে। এই কিটে ভালভ নেই: সিলিন্ডারের রেগুলেটর হাতে বন্ধ করুন।", en: "Leak confirmed. The fan is running. This kit has no valve: turn the cylinder regulator off by hand." },
  lg_checking: { bn: "গ্যাসের মাত্রা বেশি। সত্যিকারের লিক কিনা ৭ সেকেন্ড ধরে যাচাই করছে।", en: "Gas level is high. Checking for 7 seconds that it is a real leak." },
  lg_gas_off: { bn: "ভালভ বন্ধ আছে। বাতাস পরিষ্কার হলে চুলার কাছে লিভার তুলে আবার চালু করুন।", en: "The valve is closed. Once the air is clear, lift the lever at the stove to turn gas back on." },
  lg_offline: { bn: "যন্ত্রটি অনলাইনে নেই। সুরক্ষা যন্ত্রের ভেতরেই চলে, ইন্টারনেট ছাড়াও।", en: "The device is not online. Protection still runs inside the device, without the internet." },
  lg_battery: { bn: "ব্যাটারি কম। শিগগিরই বদলে দিন।", en: "Battery is low. Replace it soon." },
  lg_safe: { bn: "গ্যাস স্বাভাবিক। সব ঠিক আছে।", en: "Gas is normal. Everything is fine." },

  // Device screen
  gas: { bn: "গ্যাস", en: "Gas" },
  valve: { bn: "ভালভ", en: "Valve" },
  fan: { bn: "ফ্যান", en: "Fan" },
  battery: { bn: "ব্যাটারি", en: "Battery" },
  open: { bn: "খোলা", en: "Open" },
  closed: { bn: "বন্ধ", en: "Closed" },
  noValve: { bn: "নেই", en: "Not fitted" },
  on: { bn: "চলছে", en: "On" },
  off: { bn: "বন্ধ", en: "Off" },
  lel: { bn: "% LEL", en: "% LEL" },
  alarmAt: { bn: "সতর্কতা {n}%-এ", en: "Alarm at {n}%" },
  seconds: { bn: "{n} সেকেন্ড", en: "{n} s" },
  updated: { bn: "এইমাত্র হালনাগাদ", en: "Updated just now" },
  chain: { bn: "সুরক্ষা-শৃঙ্খল", en: "Safety chain" },
  chainDetector: { bn: "ডিটেক্টর", en: "Detector" },
  chainRelay: { bn: "রিলে ও ফ্যান", en: "Relay & fan" },
  chainValve: { bn: "ভালভ", en: "Valve" },
  watching: { bn: "নজর রাখছে", en: "Watching" },
  leakFound: { bn: "লিক পেয়েছে", en: "Leak found" },
  standby: { bn: "প্রস্তুত", en: "Standby" },
  running: { bn: "চলছে", en: "Running" },
  kitComplete: { bn: "সম্পূর্ণ কিট", en: "Complete kit" },
  kitDetectorRelay: { bn: "ডিটেক্টর + রিলে", en: "Detector + Relay" },
  closeNow: { bn: "এখনই গ্যাস বন্ধ করুন", en: "Close the gas now" },
  closeNowSub: { bn: "কানেক্টেড প্ল্যান। আবার চালু করা যায় শুধু চুলার কাছে, হাতে।", en: "Connected plan. Turning gas back on is only possible by hand, at the stove." },
  resetTitle: { bn: "কীভাবে আবার চালু করবেন", en: "How to turn gas back on" },
  reset1: { bn: "জানালা খুলুন, কোনো সুইচ বা আগুন জ্বালাবেন না।", en: "Open the windows. Do not use switches or flames." },
  reset2: { bn: "গন্ধ চলে গেলে চুলার কাছে ভালভের লিভার তুলুন।", en: "When the smell has gone, lift the valve lever at the stove." },
  reset3: { bn: "চুলা জ্বালানোর আগে আবার গন্ধ নিয়ে দেখুন।", en: "Check for any smell again before lighting the stove." },
  resetWait: { bn: "বাতাস এখনো পরিষ্কার হয়নি। ফ্যান চলছে।", en: "The air is not clear yet. The fan is running." },
  demoReset: { bn: "ডেমো: লিভার তুলে রিসেট করুন", en: "Demo: lift the lever to reset" },
  demoLeak: { bn: "ডেমো: লিক ঘটান", en: "Demo: start a leak" },
  demoRegulator: { bn: "ডেমো: রেগুলেটর হাতে বন্ধ করুন", en: "Demo: turn the regulator off by hand" },
  addValve: { bn: "স্বয়ংক্রিয়ভাবে গ্যাস বন্ধ করতে ভালভ যোগ করুন: ৳১,৭০০", en: "Add the valve to shut off gas automatically: BDT 1,700" },
  history: { bn: "সাম্প্রতিক ঘটনা", en: "Recent events" },
  noEvents: { bn: "এখনো কোনো ঘটনা নেই।", en: "Nothing has happened yet." },

  // Events
  ev_leak_confirmed: { bn: "লিক নিশ্চিত হয়েছে", en: "Leak confirmed" },
  ev_valve_closed: { bn: "ভালভ নিজেই গ্যাস বন্ধ করেছে", en: "Valve shut off the gas by itself" },
  ev_fan_on: { bn: "এগজস্ট ফ্যান চালু হয়েছে", en: "Exhaust fan switched on" },
  ev_fan_off: { bn: "ফ্যান বন্ধ হয়েছে", en: "Fan switched off" },
  ev_air_clear: { bn: "বাতাস পরিষ্কার", en: "Air is clear" },
  ev_reset: { bn: "চুলার কাছে হাতে রিসেট করা হয়েছে", en: "Reset by hand at the stove" },
  ev_remote_close: { bn: "অ্যাপ থেকে গ্যাস বন্ধ করা হয়েছে", en: "Gas closed from the app" },
  ev_regulator_off: { bn: "রেগুলেটর হাতে বন্ধ করা হয়েছে", en: "Regulator turned off by hand" },
  today: { bn: "আজ", en: "Today" },
  earlier: { bn: "আগে", en: "Earlier" },
  alertsEmpty: { bn: "কোনো সতর্কতা নেই। লিক হলে এখানে, নোটিফিকেশনে ও পরিবারের SMS-এ জানাবে।", en: "No alerts. If there is a leak you will see it here, as a notification and as an SMS to your family." },

  // Alarm sheet
  alarmTitle: { bn: "গ্যাস লিক: {name}", en: "Gas leak: {name}" },
  alarmValve: { bn: "ভালভ নিজেই গ্যাস বন্ধ করেছে", en: "The valve shut off the gas by itself" },
  alarmFan: { bn: "এগজস্ট ফ্যান গ্যাস বের করছে", en: "The exhaust fan is clearing the gas" },
  alarmNoValve: { bn: "এই কিটে ভালভ নেই: রেগুলেটর বন্ধ করুন", en: "This kit has no valve: turn off the regulator" },
  alarmNoFamily: { bn: "পরিবারের কাউকে যোগ করুন, যাতে লিক হলে তাঁরা SMS পান", en: "Add family members so they get an SMS when there is a leak" },
  alarmSms: { bn: "পরিবারের {n} জনকে SMS পাঠানো হয়েছে", en: "SMS sent to {n} family members" },
  alarmDo: { bn: "সুইচ, আগুন বা মোবাইল চার্জার ব্যবহার করবেন না। জানালা খুলুন।", en: "Do not use switches, flames or chargers. Open the windows." },
  callFamily: { bn: "পরিবারকে কল করুন", en: "Call family" },
  seeKitchen: { bn: "রান্নাঘর দেখুন", en: "See the kitchen" },
  mute: { bn: "শব্দ বন্ধ", en: "Mute" },
  notifTitle: { bn: "VenGuard: গ্যাস লিক", en: "VenGuard: gas leak" },

  // Family
  familyTitle: { bn: "পরিবার", en: "Family" },
  familyLead: { bn: "লিক হলে এঁরা সঙ্গে সঙ্গে SMS পাবেন, ফোনে ইন্টারনেট না থাকলেও। সর্বোচ্চ ৩ জন।", en: "These people get an SMS the moment there is a leak, even without internet on their phone. Up to 3 people." },
  name: { bn: "নাম", en: "Name" },
  phone: { bn: "মোবাইল নম্বর", en: "Mobile number" },
  add: { bn: "যোগ করুন", en: "Add" },
  remove: { bn: "সরান", en: "Remove" },
  full: { bn: "৩ জন যোগ হয়েছে।", en: "3 people added." },
  phoneInvalid: { bn: "০১ দিয়ে শুরু ১১ সংখ্যার নম্বর লিখুন।", en: "Enter an 11-digit number starting with 01." },
  nameMissing: { bn: "নাম লিখুন।", en: "Enter a name." },

  // Account
  accountTitle: { bn: "অ্যাকাউন্ট", en: "Account" },
  plan: { bn: "কানেক্টেড প্ল্যান", en: "Connected plan" },
  planPrice: { bn: "৳৫৫০ / বছর", en: "BDT 550 / year" },
  planDemo: { bn: "ডেমোতে চালু", en: "Active in the demo" },
  planNote: { bn: "দূর থেকে গ্যাস বন্ধ, SMS ও সতর্কতা। মূল সুরক্ষা প্ল্যান ছাড়াও পুরোপুরি কাজ করে।", en: "Remote close, SMS and alerts. Core safety works fully without the plan." },
  theme: { bn: "থিম", en: "Theme" },
  themeAuto: { bn: "স্বয়ংক্রিয়", en: "Auto" },
  themeDay: { bn: "দিন", en: "Day" },
  themeNight: { bn: "রাত", en: "Night" },
  sound: { bn: "সতর্কতার শব্দ", en: "Alarm sound" },
  notifications: { bn: "নোটিফিকেশন", en: "Notifications" },
  allow: { bn: "চালু করুন", en: "Turn on" },
  allowed: { bn: "চালু", en: "On" },
  blocked: { bn: "ফোনের সেটিংসে বন্ধ", en: "Blocked in phone settings" },
  help: { bn: "WhatsApp-এ সাহায্য", en: "Help on WhatsApp" },
  website: { bn: "VenGuard ওয়েবসাইট", en: "VenGuard website" },
  resetDemo: { bn: "ডেমো নতুন করে শুরু করুন", en: "Restart the demo" },
  version: { bn: "সংস্করণ", en: "Version" },
} as const;

export type Key = keyof typeof dict;

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

export function digits(s: string | number, lang: Lang): string {
  const str = String(s);
  return lang === "bn" ? str.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]) : str;
}

export function translate(lang: Lang, key: Key, vars?: Record<string, string | number>): string {
  let s: string = dict[key][lang];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, typeof v === "number" ? digits(v, lang) : v);
  return s;
}

export function timeOfDay(lang: Lang, date = new Date()): string {
  const h = date.getHours();
  return translate(lang, h < 12 ? "morning" : h < 17 ? "afternoon" : "evening");
}

export function clock(at: number, lang: Lang): string {
  const d = new Date(at);
  const s = d.toLocaleTimeString(lang === "bn" ? "bn-BD" : "en-GB", { hour: "numeric", minute: "2-digit" });
  return lang === "bn" ? digits(s, "bn") : s;
}
