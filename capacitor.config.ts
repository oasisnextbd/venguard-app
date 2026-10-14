import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.oasisnext.venguard",
  appName: "VenGuard",
  webDir: "dist",
  android: { backgroundColor: "#0B2A4A" },
  plugins: {
    LocalNotifications: { smallIcon: "ic_stat_venguard", iconColor: "#E85D0C" },
  },
};

export default config;
