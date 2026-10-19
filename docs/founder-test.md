# Founders' test: VenGuard Android app

We test the app the way a customer will use it, on our own phones, before any customer does.
Everything here is free (Firebase Spark plan, GitHub Pages). Report every problem in the founders'
WhatsApp group with: a screenshot, the phone model, and the app version from **Profile** (bottom of the page,
for example `0.3.0 (61)`).

## 0. One-time setup (company account, about 20 minutes)

Do this once, signed in as **oasisnextbd@gmail.com**, in <https://console.firebase.google.com> → project
**venguard-connected**.

1. **Firestore rules.** Firestore Database → Rules: replace everything with the latest
   `backend/connected-firebase/firestore.rules` from the website repository (after merging the latest
   changes), then **Publish**. This lets the app read the notice from the team dashboard.
2. **Email sign-in.** Authentication → Sign-in method → **Email/Password**: enabled.
3. **Test devices.** Register the three test devices with the steps in the private file
   *VenGuard-test-devices-PRIVATE.txt* (sent separately; it holds the device passwords). For each device:
   Authentication → Users → Add user, then three entries in Realtime Database. Keep that file among the
   founders only. Delete these test devices before real customers start.

## 1. Install once

1. On the phone, open <https://oasisnextbd.github.io/venguard-app/VenGuard.apk> and install it.
   - Samsung: Settings → Security and privacy → **Auto Blocker** off while installing, then on again.
   - If Play Protect warns: **More details → Install anyway**.
   - If an older VenGuard is installed, this installs over it as an update.
2. Open the app. The opening screen shows the logo and "Detect early, stay safe".
3. **Profile** (round button, top right) → the version at the bottom should be **0.3.0** with a build number.

From now on, new screens arrive **by themselves**: open the app, close it fully, open it again, and the
new version is there (Profile shows a higher build number). Only rare changes ask you to install a new
APK; the app then shows "Please install the new version" with a Download button.

## 2. Demo checks (no account needed)

| # | Do this | You should see |
|---|---|---|
| 2.1 | Welcome → **Start the demo** | Home with five device panels; two rows fit on screen, the fifth after scrolling |
| 2.2 | Moon/sun button in the top bar | Day (sand, like the website) ↔ Night (navy); the logo changes with it |
| 2.3 | Profile → language **বাংলা / EN** | Every screen in that language |
| 2.4 | **Edit** → red ✕ on a panel → Remove; then **+** → Add | The device goes, then comes back |
| 2.5 | Tap the **Home** panel → **Demo: start a leak** → wait | After about 7 s: app turns red, alarm sound and vibration repeat, the bar falls as the fan clears the air, then the red goes and "Gas is mitigated" shows (and as a phone notification) |
| 2.6 | On the same device after the leak | "Gas off"; the reset steps; **Demo: lift the lever to reset** brings the gas back |
| 2.7 | **History** | Each card names the place and device, with time and date |
| 2.8 | **About us** | Vision, recognition, contact, OASIS website link |

## 3. Real account with a test device (the customer path)

You need two screens: **your phone** (the customer) and **a laptop or second phone** (the device).

1. Phone: Profile → **Sign in to my VenGuard** → **Create an account** with your email and a password.
2. Phone: **+** → Add a VenGuard → Device ID **VG-TEST01** and its sticker code (in the private file).
3. Laptop: open <https://oasisnextbd.github.io/venguard-app/simulator.html> → sign in with VG-TEST01's
   device ID, device email and device password (private file). It now behaves like a real detector.
4. Each founder adds **VG-TEST01** to their own account the same way. All of you then see the same device.

| # | On the simulator | On every founder's phone (app open) |
|---|---|---|
| 3.1 | Signed in | The device panel shows **Safe**, with the place name you gave it |
| 3.2 | **Start a leak** | Red app, alarm, vibration; the device screen opens by itself; the bar rises then falls |
| 3.3 | (wait for the air to clear) | "Gas is mitigated"; the device shows **Gas off** |
| 3.4 | **Lift the reset lever** | Back to **Safe** |
| 3.5 | (phone) **Close the gas now** | The simulator closes its valve and confirms; the phone says so. The app never offers to turn gas back on |
| 3.6 | **Low battery** | Yellow border, "Battery low" |
| 3.7 | **Test button** | A new card in History |
| 3.8 | **Go offline** | After about 3 minutes: grey dashed panel, "Offline" |

VG-TEST03 is a detector + relay kit (no valve): repeat 3.2 and check it tells you to turn the regulator off by hand.

## 4. Team dashboard → app

| # | In the dashboard (Settings → VenGuard app) | In the app |
|---|---|---|
| 4.1 | Write a notice in both languages → Save | Under the top bar within 10 minutes, or at once after reopening the app; ✕ closes it |
| 4.2 | Change the notice | It shows again |
| 4.3 | Minimum version **9.9.9** → Save (test only) | "Please install the new version" with Download; the app still works |
| 4.4 | Empty the minimum version and the notice | Both go away |

## 5. Known limits during the free test

- **No alarm while the app is closed.** The phone alarms while the app is open or recently used. The
  detector's own buzzer is the main alarm. Background alarms are the next step (free relay).
- **No SMS to family** (paid everywhere in Bangladesh). Family members can install the app and add the
  same device instead.
- **Google sign-in** works in the web app only for now; on Android use email.
- **Demo devices** are made up; only VG-TEST devices behave like real ones.
