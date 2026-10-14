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
  components/           Logo, Icon, StatusPill, charts, event list, alarm sheet
  styles.css            brand tokens, Day/Night themes, all styles
public/                 icons, fonts (SIL OFL), web app manifest, service worker
android/                Capacitor Android project (committed; build output is ignored)
.github/workflows/      CI: test, build, Android APK, publish to GitHub Pages
```

## Brand rules

Same as the website (`docs/venguard/brand-rules.md` in OASIS_official_website):
VenGuard Orange `#E85D0C`, Deep Orange `#B8460A`, Guard Navy `#0B2A4A`, Sand `#FBF1EA`.
Status colours are green / ISO yellow / red only, never orange, and every status shows an
icon and a word, not colour alone. No placeholder prices or contact details.

## Connecting real devices

Screens depend only on the `Device` and `AppEvent` shapes in `src/lib/sim.ts`. To go live,
replace the `tick()` source in `src/lib/store.ts` with a subscription to the VenGuard
backend (Firebase Realtime Database; the backend lives in
`backend/connected-firebase` of the website repository), add phone-number sign-in, and
keep `remoteClose` as the only command the app can send.

## Android release signing (for Google Play)

CI signs with a shared debug key by default (fine for demos; updates install over each
other). For Play Store releases, create a keystore once and add these repository secrets:
`ANDROID_KEYSTORE_BASE64` (the .jks file, base64), `ANDROID_KEYSTORE_PASSWORD`,
`ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`. CI then builds a signed release APK.
Keep the keystore safe: losing it means you can never update the Play Store app.

## Releases

Push to `main` publishes the web app and the latest APK. Tag `v0.2.0` (after bumping
`version` in package.json) to also attach the APK to a GitHub Release.
