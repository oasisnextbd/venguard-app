import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.oasisnext.venguard",
  appName: "VenGuard",
  webDir: "dist",
  android: { backgroundColor: "#07192C" },
  plugins: {
    LocalNotifications: { smallIcon: "ic_stat_venguard", iconColor: "#FA5806" },
  },
};

export default config;
