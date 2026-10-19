/** All interface text, Bangla first. Keys are grouped by screen. */
export type Lang = "bn" | "en";

const dict = {
  // App frame
  tabHome: { bn: "হোম", en: "Home" },
  tabAlerts: { bn: "সতর্কতা", en: "Alerts" },
  tabFamily: { bn: "পরিবার", en: "Family" },
  tabAccount: { bn: "অ্যাকাউন্ট", en: "Account" },
  back: { bn: "ফিরে যান", en: "Back" },
  // Brand motto on the opening screen (Android app): English in both languages, by the founders' choice.
  motto: { bn: "Detect early, stay safe", en: "Detect early, stay safe" },

  // Welcome
  tagline: { bn: "নিজেই রক্ষা করে।", en: "Safety that acts." },
  welcomeLead: { bn: "গ্যাস লিক হলে VenGuard নিজেই ভালভ বন্ধ করে ও এগজস্ট ফ্যান চালু করে। এই অ্যাপে আপনি দূর থেকে সব দেখতে পান।", en: "When gas leaks, VenGuard closes the valve and starts the exhaust fan by itself. This app lets you see it all from anywhere." },
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
  alarmDo: { bn: "সুইচ, আগুন বা মোবাইল চার্জার ব্যবহার করবেন না। জানালা খুলুন।", en: "Do not use switches, flames or chargers. Open the windows." },
  callFamily: { bn: "পরিবারকে কল করুন", en: "Call family" },
  seeKitchen: { bn: "রান্নাঘর দেখুন", en: "See the kitchen" },
  mute: { bn: "শব্দ বন্ধ", en: "Mute" },
  notifTitle: { bn: "VenGuard: গ্যাস লিক", en: "VenGuard: gas leak" },
  mitigatedTitle: { bn: "গ্যাস নিয়ন্ত্রণে এসেছে", en: "Gas is mitigated" },
  updateNeeded: { bn: "অ্যাপের নতুন সংস্করণ ইনস্টল করুন", en: "Please install the new version of the app" },
  updateNeededSub: { bn: "ডাউনলোড করে খুলুন, তারপর আপডেট চাপুন। আপনার সেটিংস থেকে যাবে।", en: "Download it, open it and tap Update. Your settings stay." },
  download: { bn: "ডাউনলোড", en: "Download" },
  mitigatedBody: { bn: "{place}: গ্যাসের মাত্রা আবার স্বাভাবিক।", en: "{place}: the gas level is back to normal." },

  // Family
  familyTitle: { bn: "পরিবার", en: "Family" },
  familyLeadPilot: { bn: "লিক হলে এঁদের SMS পাঠানো হবে — SMS সতর্কতা চালু হওয়ার পর (শিগগিরই)। সর্বোচ্চ ৩ জন।", en: "These people will get an SMS when there is a leak, once SMS alerts are switched on (coming soon). Up to 3 people." },
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
  planNote: { bn: "দূর থেকে গ্যাস বন্ধ, SMS ও সতর্কতা। মূল সুরক্ষা প্ল্যান ছাড়াও পুরোপুরি কাজ করে।", en: "Remote close, SMS and alerts. Core safety works fully without the plan." },
  theme: { bn: "থিম", en: "Theme" },
  themeAuto: { bn: "স্বয়ংক্রিয়", en: "Auto" },
  themeDay: { bn: "দিন", en: "Day" },
  themeNight: { bn: "রাত", en: "Night" },
  toDay: { bn: "দিনের থিমে যান", en: "Switch to day theme" },
  toNight: { bn: "রাতের থিমে যান", en: "Switch to night theme" },
  sound: { bn: "সতর্কতার শব্দ", en: "Alarm sound" },
  notifications: { bn: "নোটিফিকেশন", en: "Notifications" },
  allow: { bn: "চালু করুন", en: "Turn on" },
  allowed: { bn: "চালু", en: "On" },
  blocked: { bn: "ফোনের সেটিংসে বন্ধ", en: "Blocked in phone settings" },
  help: { bn: "WhatsApp-এ সাহায্য", en: "Help on WhatsApp" },
  website: { bn: "VenGuard ওয়েবসাইট", en: "VenGuard website" },
  version: { bn: "সংস্করণ", en: "Version" },

  // Live mode: sign-in
  signInReal: { bn: "আমার VenGuard-এ সাইন ইন", en: "Sign in to my VenGuard" },
  signInTitle: { bn: "সাইন ইন", en: "Sign in" },
  signInLead: { bn: "আপনার মোবাইল নম্বরে একটি ৬ সংখ্যার কোড পাঠানো হবে।", en: "We will send a 6-digit code to your mobile number." },
  sendCode: { bn: "কোড পাঠান", en: "Send code" },
  codeLabel: { bn: "৬ সংখ্যার কোড", en: "6-digit code" },
  codeSentTo: { bn: "{phone} নম্বরে কোড পাঠানো হয়েছে।", en: "Code sent to {phone}." },
  verify: { bn: "যাচাই করুন", en: "Verify" },
  changeNumber: { bn: "নম্বর বদলান", en: "Change number" },
  wrongCode: { bn: "কোডটি সঠিক নয় বা মেয়াদ শেষ। আবার চেষ্টা করুন।", en: "That code is wrong or has expired. Try again." },
  tooMany: { bn: "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।", en: "Too many attempts. Please try again later." },
  badPhone: { bn: "০১ দিয়ে শুরু ১১ সংখ্যার নম্বর লিখুন।", en: "Enter an 11-digit number starting with 01." },
  notAllowed: { bn: "এই পদ্ধতিতে এখন সাইন ইন করা যাচ্ছে না। অন্য পদ্ধতি চেষ্টা করুন।", en: "This sign-in method is not available yet. Please try another one." },
  signInFailed: { bn: "সাইন ইন হয়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।", en: "Sign-in failed. Check your internet connection and try again." },
  pilotNote: { bn: "পাইলট পর্যায়: ফোন নম্বরে শুধু অনুমোদিত নম্বর দিয়ে সাইন ইন করা যায়। অন্যরা Google বা ইমেইল ব্যবহার করুন।", en: "Pilot stage: phone sign-in works only for approved numbers. Everyone else, please use Google or email." },
  continueGoogle: { bn: "Google দিয়ে চালিয়ে যান", en: "Continue with Google" },
  orEmail: { bn: "অথবা ইমেইল দিয়ে", en: "or with email" },
  email: { bn: "ইমেইল", en: "Email" },
  password: { bn: "পাসওয়ার্ড", en: "Password" },
  passwordHint: { bn: "কমপক্ষে {n} অক্ষর।", en: "At least {n} characters." },
  signInBtn: { bn: "সাইন ইন", en: "Sign in" },
  createTitle: { bn: "নতুন অ্যাকাউন্ট", en: "Create an account" },
  createBtn: { bn: "অ্যাকাউন্ট খুলুন", en: "Create account" },
  createLink: { bn: "নতুন অ্যাকাউন্ট খুলুন", en: "Create an account" },
  haveAccount: { bn: "আগের অ্যাকাউন্টে সাইন ইন", en: "Back to sign in" },
  forgotLink: { bn: "পাসওয়ার্ড ভুলে গেছেন?", en: "Forgot password?" },
  forgotTitle: { bn: "পাসওয়ার্ড রিসেট", en: "Reset password" },
  forgotLead: { bn: "আপনার ইমেইল লিখুন। নতুন পাসওয়ার্ড দেওয়ার একটি লিংক পাঠানো হবে।", en: "Enter your email. We will send a link to set a new password." },
  sendReset: { bn: "লিংক পাঠান", en: "Send link" },
  resetSent: { bn: "{email} ঠিকানায় অ্যাকাউন্ট থাকলে লিংক পাঠানো হয়েছে। স্প্যাম ফোল্ডারও দেখুন।", en: "If {email} has an account, a link is on its way. Check the spam folder too." },
  usePhone: { bn: "ফোন নম্বর দিয়ে সাইন ইন", en: "Sign in with a phone number" },
  useEmail: { bn: "Google বা ইমেইল দিয়ে সাইন ইন", en: "Sign in with Google or email" },
  wrongPassword: { bn: "ইমেইল বা পাসওয়ার্ড মিলছে না।", en: "The email or password is not right." },
  emailInUse: { bn: "এই ইমেইলে আগেই অ্যাকাউন্ট আছে। সাইন ইন করুন বা পাসওয়ার্ড রিসেট করুন।", en: "This email already has an account. Sign in, or reset the password." },
  weakPassword: { bn: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের দিন।", en: "Use a password of at least 8 characters." },
  badEmail: { bn: "সঠিক ইমেইল ঠিকানা লিখুন।", en: "Enter a valid email address." },
  noGoogleAccount: { bn: "এই ফোনে কোনো Google অ্যাকাউন্ট নেই। ফোনের সেটিংস → অ্যাকাউন্টস-এ যোগ করুন, অথবা ইমেইল দিয়ে সাইন ইন করুন।", en: "There is no Google account on this phone. Add one in the phone's Settings → Accounts, or sign in with email." },
  popupBlocked: { bn: "ব্রাউজার Google-এর জানালা আটকে দিয়েছে। পপ-আপ চালু করে আবার চেষ্টা করুন।", en: "The browser blocked the Google window. Allow pop-ups for this site and try again." },
  cancelled: { bn: "বাতিল করা হয়েছে।", en: "Cancelled." },
  loading: { bn: "লোড হচ্ছে…", en: "Loading…" },
  // Live mode: devices
  addDeviceTitle: { bn: "VenGuard যোগ করুন", en: "Add a VenGuard" },
  addDeviceLead: { bn: "যন্ত্রের স্টিকার বা বাক্সে লেখা আইডি ও কোড লিখুন।", en: "Type the ID and code printed on the device sticker or the box." },
  deviceId: { bn: "যন্ত্রের আইডি", en: "Device ID" },
  stickerCode: { bn: "স্টিকার কোড", en: "Sticker code" },
  placeName: { bn: "জায়গার নাম", en: "Place name" },
  placeNameHint: { bn: "যেমন: বাসা, মায়ের ফ্ল্যাট", en: "For example: Home, Mother's flat" },
  areaLabel: { bn: "এলাকা", en: "Area" },
  addBtn: { bn: "যোগ করুন", en: "Add device" },
  claimFailed: { bn: "আইডি বা কোড মিলছে না। স্টিকারটি আবার দেখুন।", en: "The ID or code does not match. Check the sticker again." },
  idInvalid: { bn: "আইডি দেখতে এমন: VG-0001A3", en: "The ID looks like VG-0001A3." },
  codeInvalid: { bn: "কোডটি ১২ অক্ষরের।", en: "The code has 12 characters." },
  noDevicesTitle: { bn: "এখনো কোনো যন্ত্র নেই", en: "No devices yet" },
  noDevicesLead: { bn: "আপনার VenGuard যোগ করলে এখানে লাইভ অবস্থা দেখাবে।", en: "Add your VenGuard and its live status appears here." },
  addAnother: { bn: "আরেকটি যন্ত্র যোগ করুন", en: "Add another device" },
  closeSent: { bn: "অনুরোধ পাঠানো হয়েছে। যন্ত্রের উত্তরের অপেক্ষায়…", en: "Request sent. Waiting for the device…" },
  closeDone: { bn: "যন্ত্র নিশ্চিত করেছে: ভালভ বন্ধ।", en: "The device confirmed: valve closed." },
  closeFailed: { bn: "ভালভ বন্ধ নিশ্চিত হয়নি। সিলিন্ডারের রেগুলেটর হাতে বন্ধ করুন।", en: "The valve did not confirm. Turn the cylinder regulator off by hand." },
  offlineNoClose: { bn: "যন্ত্র অনলাইনে নেই, তাই দূর থেকে বন্ধ করা যাচ্ছে না।", en: "The device is offline, so it cannot be closed remotely." },
  // Live mode: account
  signedInAs: { bn: "সাইন ইন: {who}", en: "Signed in: {who}" },
  signOut: { bn: "সাইন আউট", en: "Sign out" },
  pilot: { bn: "পাইলট", en: "Pilot" },
  ev_test: { bn: "পরীক্ষা বোতাম চাপা হয়েছে", en: "Test button pressed" },
  ev_battery_low: { bn: "ব্যাটারি কম", en: "Battery low" },
  ev_tamper: { bn: "যন্ত্রে হাত দেওয়া হয়েছে", en: "Device tampered with" },

  // Phone layout (Android app): bars, home panels, about
  tabHistory: { bn: "ইতিহাস", en: "History" },
  tabAbout: { bn: "আমাদের কথা", en: "About us" },
  profile: { bn: "প্রোফাইল", en: "Profile" },
  myDevices: { bn: "আমার ডিভাইস সমূহ", en: "My devices" },
  edit: { bn: "সম্পাদনা", en: "Edit" },
  done: { bn: "শেষ", en: "Done" },
  cancel: { bn: "বাতিল", en: "Cancel" },
  removeAsk: { bn: "{name} সরাবেন?", en: "Remove {name}?" },
  removeNote: { bn: "এটি শুধু আপনার অ্যাকাউন্ট থেকে সরবে; যন্ত্র চালু থাকবে। আইডি ও স্টিকার কোড দিয়ে আবার যোগ করা যাবে।", en: "It leaves your account only; the device keeps working. You can add it again with its ID and sticker code." },
  removeFailed: { bn: "সরানো যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।", en: "Could not remove it. Check the internet and try again." },
  removeThis: { bn: "সরান: {name}", en: "Remove {name}" },
  close: { bn: "বন্ধ করুন", en: "Close" },
  sh_safe: { bn: "কোনো গ্যাস লিক নেই", en: "No gas leak" },
  sh_danger: { bn: "লিক নিশ্চিত হয়েছে", en: "Leak confirmed" },
  sh_checking: { bn: "গ্যাস বেশি, যাচাই হচ্ছে", en: "High gas, checking" },
  sh_gas_off: { bn: "ভালভ বন্ধ আছে", en: "Valve is closed" },
  sh_offline: { bn: "যন্ত্র অনলাইনে নেই", en: "Device not online" },
  sh_battery: { bn: "শিগগিরই ব্যাটারি বদলান", en: "Replace the battery soon" },
  aboutVision: { bn: "আমাদের লক্ষ্য", en: "Our vision" },
  vision: { bn: "বিপদের আগেই জীবন রক্ষা: নিরাপদ রান্নাঘর, টেকসই অবকাঠামো ও দায়িত্বশীল উৎপাদন, বাংলাদেশ থেকে বিশ্বে।", en: "Protecting lives before danger strikes: safer kitchens, resilient infrastructure and responsible production, from Bangladesh to the world." },
  aboutRecognition: { bn: "স্বীকৃতি", en: "Recognition" },
  aboutContact: { bn: "যোগাযোগ", en: "Contact" },
  rec_fair: { bn: "বাংলাদেশ উদ্ভাবন মেলা ২০২৬-এ শীর্ষ ৫০", en: "Top 50, Bangladesh Innovation Fair 2026" },
  rec_cohort: { bn: "প্রথম রানার-আপ, ইনোভেশন কোহর্ট ২০২৬", en: "1st runner-up, Innovation Cohort 2026" },
  rec_koica: { bn: "KOICA আইডিয়া কম্পিটিশন ২০২৬-এ প্রথম", en: "1st place, KOICA Idea Competition 2026" },
  rec_uihp: { bn: "UIHP থেকে ৮০,০০০ টাকা সিড ফান্ডিং", en: "BDT 80,000 seed funding, UIHP" },
  rec_buet: { bn: "বুয়েট BRTC-তে স্বাধীন পরীক্ষা (চলছে)", en: "Independent testing at BUET BRTC (in progress)" },
  aboutOasis: { bn: "OASIS-এর অন্যান্য পণ্য দেখুন", en: "Check other products by OASIS" },
  oasisSite: { bn: "OASIS ওয়েবসাইট", en: "OASIS website" },
  // Phone layout: device screen
  gasLevel: { bn: "গ্যাসের মাত্রা", en: "Gas level" },
  inAir: { bn: "বাতাসে প্রায় {v}% গ্যাস", en: "About {v}% gas in the air" },
  alarmMark: { bn: "সতর্কতা", en: "Alarm" },
  lflNote: { bn: "LFL: বাতাসে যত কম গ্যাস থাকলে আগুন ধরতে পারে। HFL: সর্বোচ্চ সীমা। এর মাঝে বাতাস জ্বলে উঠতে পারে। VenGuard-এর সতর্কতা LFL-এর {n}%-এ সেট করা।", en: "LFL: the least gas in the air that can burn. HFL: the most. In between, the air can catch fire. VenGuard's alarm is set at {n}% of the LFL." },
  connection: { bn: "সংযোগ", en: "Connection" },
  online: { bn: "অনলাইন", en: "Online" },
  batteryGood: { bn: "ভালো", en: "Good" },
  parts: { bn: "যন্ত্রাংশ", en: "Parts" },
  sensor: { bn: "সেন্সর", en: "Sensor" },
  gasFlowing: { bn: "গ্যাস চলছে", en: "Gas flowing" },
  gasShut: { bn: "গ্যাস বন্ধ", en: "Gas shut off" },
  noData: { bn: "অফলাইন, তাই এখন তথ্য নেই", en: "Offline, so no reading now" },
  deviceIdLabel: { bn: "যন্ত্রের আইডি: {id}", en: "Device ID: {id}" },
  seeAllHistory: { bn: "সব ইতিহাস দেখুন", en: "See all history" },
  // Phone layout: history
  activityTitle: { bn: "কার্যকলাপ", en: "Activity" },
  activityCount: { bn: "{n}টি ঘটনা রেকর্ড আছে", en: "{n} events recorded" },
  recentActivity: { bn: "সাম্প্রতিক কার্যকলাপ", en: "Recent activity" },
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
