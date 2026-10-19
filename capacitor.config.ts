import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.oasisnext.venguard",
  appName: "VenGuard",
  webDir: "dist",
  android: { backgroundColor: "#07192C" },
  plugins: {
    LocalNotifications: { smallIcon: "ic_stat_venguard", iconColor: "#FA5806" },
    // In-app updates (src/lib/updates.ts): checked by the app itself from our GitHub Pages.
    // autoUpdate off = no Capgo cloud; statsUrl "" = no usage reports sent anywhere.
    CapacitorUpdater: { autoUpdate: false, statsUrl: "", appReadyTimeout: 10000 },
  },
};

export default config;
