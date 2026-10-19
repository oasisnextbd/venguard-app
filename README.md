# VenGuard app

The VenGuard mobile app for Android, also available as an installable web app.
VenGuard is an automatic LPG gas shut-off system for kitchens in Bangladesh: detector,
active ventilation relay and automatic valve. This app shows every kitchen's gas level,
valve, fan and battery, raises a full-screen alarm on a leak, and lets the owner close
the gas remotely (Connected plan). Gas can never be turned back on from the app.

**Status: demo.** Devices are simulated (`src/lib/sim.ts`) so the app can be shown
anywhere. Real devices connect in a later update; see "Connecting real devices".

| | |
|---|---|
| Web app | https://oasisnextbd.github.io/venguard-app/ |
| Android app (APK) | https://oasisnextbd.github.io/venguard-app/VenGuard.apk |
| Website | https://oasisnextbd.github.io/OASIS_official_website/VENGuard/ |

## Install on an Android phone

1. Open the APK link above on the phone and download it.
2. Allow "Install unknown apps" for the browser when Android asks.
3. Open VenGuard and tap **Start the demo**.

Google Play comes later (one-time USD 25 developer account, plus release signing below).

## Demo script (2 minutes)

1. Home shows every kitchen and a building with 12 flats.
2. Tap **Demo: trigger a leak and watch**. The Home kitchen's gas rises; the app shows
   "Checking" for 7 seconds (cooking smells never trigger it).
3. The leak is confirmed: full-screen alarm, sound, vibration and notification. The valve
   has closed by itself and the ventilation relay has started the exhaust fan.
4. **See the kitchen**: the gauge falls as the fan clears the air; the fan stops on its own.
5. Follow the reset steps and tap **Demo: lift the lever to reset**.
6. *Mother's flat* has the Detector + Relay kit (no valve): trigger a leak there to show
   the fan runs but the gas must be turned off by hand.

## Develop

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # simulator unit tests
npm run typecheck
npm run build        # web build in dist/
```

Android (needs Android Studio / Android SDK and Java 17):

```bash
npm run android:sync # build the web app and copy it into android/
npm run android:open # open in Android Studio, then Run
```

## Structure

```
src/
  main.tsx, App.tsx     entry point, app shell, tab bar, theme
  lib/sim.ts            device behaviour (pure functions, unit-tested in sim.test.ts)
  lib/demo.ts           demo sites and devices
  lib/store.ts          app state, the 1-second simulation tick, alarm handling
  lib/platform.ts       notifications, vibration, alarm sound, status bar (native or web)
  lib/i18n.ts           all text, Bangla and English
  lib/router.ts         hash routes (#/device/<id> …)
  screens/              Home, Device, Site (building), Alerts, Family, Account, Welcome
  components/           Logo, Icon, StatusPill, charts, event list, alarm sheet, Splash
  phone/                Android app layout: PhoneShell (top and bottom bars), PhoneHome, Details, About
  lib/company.ts        company facts for Account and About us (copied from the website's site.json)
  styles.css            brand tokens, Day/Night themes, all styles
public/                 icons, fonts (SIL OFL), web app manifest, service worker
android/                Capacitor Android project (committed; build output is ignored)
.github/workflows/      CI: test, build, Android APK, publish to GitHub Pages
```

## Brand rules

Same as the website (`docs/venguard/brand-rules.md` in OASIS_official_website):
VenGuard Orange `#E85D0C`, Deep Orange `#B8460A`, Guard Navy `#0B2A4A`, Sand `#FBF1EA`.

Logo: follow the Logo Guidelines v1.0 (`docs/venguard/VenGuard_Logo_Guidelines.docx` in the website
repo). `src/components/Logo.tsx` shows the primary lockup on light and the reversed lockup on dark
(files in `public/brand/`, at least 31 px tall / 120 px wide). App, launcher, favicon and notification
icons use the symbol: reversed symbol on Deep Navy `#07192C` (`public/icons/`, `android/app/src/main/res/`;
the notification icon is a white silhouette as Android requires). Replace the files with the designer's
vector master when it exists, keeping the names. Only the logo follows that guide: the app keeps the colours, fonts and themes above.

**Android app vs web app.** Both are built from the same code; anything only for the Android app checks
`isNative` (`src/lib/platform.ts`) and leaves the web app unchanged. So far: the opening screen
(`src/components/Splash.tsx`): the reversed logo and the motto ("Detect early, stay safe", text key
`motto`, English in both languages) on Deep Navy for about 2 seconds at start-up. Android's own start-up screen before it is plain
navy with no icon (`android/app/src/main/res/values/splash.xml`, `values/styles.xml`), so the two read as one.

The Android app also has its own layout (`src/phone/`, switched on by `phoneUI` in `src/lib/platform.ts`):
- Top bar: VenGuard symbol (left), the name (middle), profile button (right, opens Account).
- Bottom bar in VenGuard Orange with navy icons: Home, Details, History, About us. Family moved into Account.
- Home: one panel per device with its place and one reading (its status); the border is the status
  colour (green = no gas leak). One device fills the screen, up to four fit (two by two), more scroll.
- Demo: five places (`PHONE_SITES`, `seedPhoneDevices()` in `src/lib/demo.ts`); **Edit** removes a device
  and **+** adds it back (`actions.removeDevice` / `restoreDevice`). In live mode + adds a real device;
  removing a real device needs a backend change first and is not offered yet.
- See it in a browser while developing: `npm run dev`, then open `http://localhost:5173/?phone`.

Status colours are green / ISO yellow / red only, never orange, and every status shows an
icon and a word, not colour alone. No placeholder prices or contact details.

## Live mode (real devices)

The welcome screen offers **Sign in to my VenGuard** next to the demo. Live mode uses the Firebase
project `venguard-connected` on the free Spark plan (`src/lib/firebase.ts`, loaded only on sign-in):

- Sign-in (`src/screens/SignIn.tsx`; enable each method in Firebase console → Authentication →
  Sign-in method):
  - **Continue with Google** — web only. Google blocks its sign-in page inside app WebViews, so the
    Android app hides it until the native Firebase plugin is added (needs `google-services.json` and
    the APK's SHA-1 in the Firebase console).
  - **Email + password** — web and Android, with "Forgot password?" (Firebase sends the reset email).
  - **Phone number** — only the test numbers set in the console during the pilot (real SMS needs a
    paid plan; on Android also the native plugin).

  Devices belong to the Firebase account (uid), so each sign-in method is a separate account: a device
  added under the phone account is not seen by the Google account until it is added there too.
- **Add a VenGuard** with the device ID and 12-character code from its sticker.
- Live gas level, valve, fan, battery and history; the full-screen alarm when a device reports a leak;
  **Close the gas now** sends a `close` command and shows the device's confirmation. There is no way
  to send "open"; the database rules refuse it.
- Not on the free plan: SMS to family, notifications while the app is closed, online payment.

Backend, security rules and the device side: `backend/connected-firebase` in the website repository
(`database.rules.json`, `DEVICE_API.md` → "Free plan (Spark) edition", `tools/provision-spark.mjs`).

`src/lib/live.ts` maps the database into the same `Device`/`AppEvent` shapes the demo uses, so every
screen works in both modes. End-to-end check (customer in a browser + simulated device through the
rules): run the Auth and Database emulators, load the rules, then `VITE_FIREBASE_EMULATORS=1 npm run dev`.

**Link from the website:** `https://oasisnextbd.github.io/venguard-app/#/welcome` (or `#/welcome/bn`,
`#/welcome/en`) always opens the welcome screen with both choices, the demo and sign-in, even in a
browser that was left in the demo. Someone already signed in goes straight to their devices
(`src/main.tsx`).

## Device simulator (demos and firmware work)

`simulator.html` (published at https://oasisnextbd.github.io/venguard-app/simulator.html) signs in as
one device and behaves like it, through the same database paths and rules as real firmware: it
reports state and heartbeat, posts events, and obeys `close` commands (acts, acks once, clears the
command). It reuses `src/lib/sim.ts`, so it behaves exactly like the in-app demo. Buttons: start a
leak, turn the regulator off, lift the reset lever, low battery, test button, go offline.
Register a demo device first (see the website repo: `tools/provision-spark.mjs` and the setup guide).

## Android release signing (for Google Play)

CI signs with a shared debug key by default (fine for demos; updates install over each
other). For Play Store releases, create a keystore once and add these repository secrets:
`ANDROID_KEYSTORE_BASE64` (the .jks file, base64), `ANDROID_KEYSTORE_PASSWORD`,
`ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`. CI then builds a signed release APK.
Keep the keystore safe: losing it means you can never update the Play Store app.

## Releases

Push to `main` publishes the web app and the latest APK. Tag `v0.2.0` (after bumping
`version` in package.json) to also attach the APK to a GitHub Release.
