# Founders' test: VenGuard Android app

We test the app the way a customer will use it, on our own phones, with **emulators**: test devices in
the team dashboard that behave exactly like a real VenGuard (detector, valve, relay) through the same
database and rules. The app has no demo or made-up devices. Everything here is free (Firebase Spark plan,
GitHub Pages). Report every problem in the founders' WhatsApp group with a screenshot, the phone model,
and the app version from **Profile** (bottom of the page, for example `0.3.0 (65)`).

## 0. One-time setup (company account, about 15 minutes)

1. Merge the website changes (link from Claude), so the dashboard has the Emulators section.
2. In <https://console.firebase.google.com> → project **venguard-connected**, signed in as
   **oasisnextbd@gmail.com**:
   - **Firestore Database → Rules**: replace with `backend/connected-firebase/firestore.rules` → **Publish**.
   - **Realtime Database → Rules**: replace with `backend/connected-firebase/database.rules.json` → **Publish**.
   - **Authentication → Sign-in method → Email/Password**: enabled.
3. Team dashboard (company account) → **Settings & team → Team**: the four founders are on the list with
   the role **Founder**.
4. Team dashboard → **Emulators** → **Create emulator** four times (VG-EMU01 … VG-EMU04), and assign each
   to one founder. Only that founder and the company account can see it.

## 1. Install once

1. On the phone, open <https://oasisnextbd.github.io/venguard-app/VenGuard.apk> and install it.
   - Samsung: Settings → Security and privacy → **Auto Blocker** off while installing, then on again.
   - If Play Protect warns: **More details → Install anyway**.
2. Open the app: the opening screen, then **Sign in**. Tap **Create an account** and use your email.
3. **Profile** (round button, top right) shows the version. From now on new versions arrive by
   themselves: open the app, close it fully, open it again.

## 2. Your emulator (each founder)

1. On a laptop, open the team dashboard and sign in with your Google account → **Emulators**. You see
   only your emulator, with its **device ID** and **sticker code**.
2. Phone: **+** (top right of Home) → **Add a VenGuard** → the device ID, the sticker code, a place name
   (e.g. Home) and an area → **Add device**.
3. Dashboard: press **Start**. Keep that page open while you test (close it and the app shows the
   device offline within 3 minutes).

| # | In the dashboard | On your phone |
|---|---|---|
| 2.1 | Start | The panel shows **Safe** with a green border |
| 2.2 | **Start a leak** | After about 7 s the app turns red, alarm sound and vibration repeat, the device screen opens by itself; the bar rises, then falls as the fan clears the air |
| 2.3 | (wait) | The red goes and **Gas is mitigated** shows (also as a notification); the device shows **Gas off** |
| 2.4 | **Lift the reset lever** | Back to **Safe** |
| 2.5 | (phone) **Close the gas now** on the device screen | The dashboard log says the valve closed; the phone confirms. The app never offers to turn gas back on |
| 2.6 | **Low battery** | Yellow border, "Battery low" |
| 2.7 | **Test button** | A new card in **History** |
| 2.8 | **Go offline** | After about 3 minutes: grey dashed panel, "Offline" |
| 2.9 | (phone) **Edit** → ✕ → Remove | The device leaves your account; add it again with + |

A detector + relay emulator (create one with that kit) has no valve: in 2.2 the app tells you to turn the
regulator off by hand; use **Turn the regulator off** in the dashboard.

Several founders can add the same emulator to their own accounts (same ID and code) to see one leak on
several phones at once.

## 3. Team dashboard → app

| # | Dashboard → Settings → VenGuard app | In the app |
|---|---|---|
| 3.1 | Write a notice (English) → Save | Under the top bar within 10 minutes, or at once after reopening the app; ✕ closes it |
| 3.2 | Minimum version **9.9.9** → Save (test only) | "Please install the new version" with Download; the app still works |
| 3.3 | Empty both again | Both go away |

## 4. Known limits during the free test

- **No phone alarm while the app is closed.** The phone alarms while the app is open or recently used;
  the detector's own buzzer still sounds. Background alarms on the phone are the next step (free relay).
- **No SMS to family** (paid everywhere in Bangladesh). Family members can install the app and add the
  same device instead.
- **Google sign-in** works in the web app only for now; on Android use email.
