import { useEffect } from "react";
import { AlarmSheet } from "./components/AlarmSheet";
import { Icon, type IconName } from "./components/Icon";
import { Logo } from "./components/Logo";
import { setStatusBar } from "./lib/platform";
import { type Route, href, useRoute } from "./lib/router";
import { statusOf } from "./lib/sim";
import { useApp } from "./lib/store";
import { useT } from "./lib/useT";
import { Account } from "./screens/Account";
import { Alerts } from "./screens/Alerts";
import { DeviceScreen } from "./screens/Device";
import { Family } from "./screens/Family";
import { Home } from "./screens/Home";
import { SiteScreen } from "./screens/Site";
import { Welcome } from "./screens/Welcome";
import { AddDevice } from "./screens/AddDevice";
import { SignIn } from "./screens/SignIn";

const TABS: { route: Route; icon: IconName; label: "tabHome" | "tabAlerts" | "tabFamily" | "tabAccount" }[] = [
  { route: { name: "home" }, icon: "home", label: "tabHome" },
  { route: { name: "alerts" }, icon: "bell", label: "tabAlerts" },
  { route: { name: "family" }, icon: "users", label: "tabFamily" },
  { route: { name: "account" }, icon: "user", label: "tabAccount" },
];

function useTheme() {
  const { theme } = useApp();
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "auto" && mq.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#07192C" : "#FFFFFF");
      void setStatusBar(dark);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
}

export function App() {
  const { started, mode, auth, lang, events, devices } = useApp();
  const { t } = useT();
  const route = useRoute();
  useTheme();
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  if (!started) return <Welcome />;
  if (mode === "live" && auth === undefined) return <main className="welcome"><p className="muted">{t("loading")}</p></main>;
  if (mode === "live" && auth === null) return <SignIn />;

  const tabOf = route.name === "device" || route.name === "site" || route.name === "add" ? "home" : route.name;
  const unread = Object.values(devices).some((d) => statusOf(d) === "danger") ? 1 : 0;

  return (
    <div className="shell">
      <a className="skip-link" href="#content">{t("tabHome")}</a>
      <header className="topbar">
        <a href="#/" className="topbar-logo" aria-label="VenGuard"><Logo size={24} /></a>
        {mode === "demo" && <span className="demo-chip" title={t("demoNote")}>{t("demo")}</span>}
        <nav className="tabs" aria-label="VenGuard">
          {TABS.map((tab) => (
            <a key={tab.label} href={href(tab.route)} aria-current={tabOf === tab.route.name ? "page" : undefined}>
              <span className="tab-icon">
                <Icon name={tab.icon} />
                {tab.label === "tabAlerts" && (unread > 0 || events.length > 0) && <i className={unread ? "badge badge--hot" : "badge"} />}
              </span>
              <span>{t(tab.label)}</span>
            </a>
          ))}
        </nav>
      </header>
      <div id="content">
        {route.name === "home" && <Home />}
        {route.name === "device" && <DeviceScreen id={route.id} />}
        {route.name === "site" && <SiteScreen id={route.id} />}
        {route.name === "alerts" && <Alerts />}
        {route.name === "family" && <Family />}
        {route.name === "account" && <Account />}
        {route.name === "add" && <AddDevice />}
      </div>
      <AlarmSheet />
    </div>
  );
}
