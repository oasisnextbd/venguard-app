/**
 * Android app layout: top bar (symbol, name, Day/Night and profile), the screen, and the orange bottom bar
 * (Home, History, About us). The web app uses the shell in App.tsx instead.
 * During a leak there is no separate alarm page: the app turns red, opens that device so its gas bar
 * can be watched going down, and shows LeakBanner on top (see LeakAlert.tsx).
 */
import { useEffect } from "react";
import { Icon, type IconName } from "../components/Icon";
import { ThemeToggle, isDark } from "../components/QuickSettings";
import { setStatusBar, setStatusBarAlarm } from "../lib/platform";
import { type Route, go, href } from "../lib/router";
import { statusOf } from "../lib/sim";
import { useApp } from "../lib/store";
import { useT } from "../lib/useT";
import { Account } from "../screens/Account";
import { AddDevice } from "../screens/AddDevice";
import { Family } from "../screens/Family";
import { SiteScreen } from "../screens/Site";
import { About } from "./About";
import { History } from "./History";
import { LeakBanner, MitigatedMessage } from "./LeakAlert";
import { Notices } from "./Notices";
import { PhoneDevice } from "./PhoneDevice";
import { PhoneHome } from "./PhoneHome";

const BASE = import.meta.env.BASE_URL;

type Tab = "home" | "alerts" | "about";
const TABS: { tab: Tab; icon: IconName; label: "tabHome" | "tabHistory" | "tabAbout" }[] = [
  { tab: "home", icon: "home", label: "tabHome" },
  { tab: "alerts", icon: "history", label: "tabHistory" },
  { tab: "about", icon: "info", label: "tabAbout" },
];

/** Which bottom-bar item a screen belongs to (none for Profile and Family). */
function tabOf(r: Route): Tab | null {
  if (r.name === "device" || r.name === "site" || r.name === "add") return "home";
  if (r.name === "home" || r.name === "alerts" || r.name === "about") return r.name;
  return null;
}

export function PhoneShell({ route }: { route: Route }) {
  const { auth, events, devices, alarmFor, mitigated, theme } = useApp();
  const { t } = useT();
  const current = tabOf(route);
  const leak = alarmFor && devices[alarmFor]?.alarm ? alarmFor : null;

  // A new leak opens that device; the status bar turns red with the app and back after.
  useEffect(() => { if (leak) go({ name: "device", id: leak }); }, [leak]);
  useEffect(() => { void (leak ? setStatusBarAlarm() : setStatusBar(isDark(theme))); }, [leak, theme]);
  const hot = Object.values(devices).some((d) => statusOf(d) === "danger");
  const initial = auth ? auth.who.replace(/^\+88/, "").charAt(0).toUpperCase() : "";

  return (
    <div className={leak ? "pshell pshell--alarm" : "pshell"}>
      <header className="ptop">
        {/* Logo Guidelines v1.0: full-colour symbol by day, reversed at night (CSS shows one from the theme). */}
        <a href="#/" className="ptop-logo" aria-label={t("tabHome")}>
          <img className="logo-img logo-img--light" src={`${BASE}brand/VenGuard_Symbol_FullColour_RGB.svg`} width={34} height={34} alt="" />
          <img className="logo-img logo-img--dark" src={`${BASE}brand/VenGuard_Symbol_Reversed_RGB.svg`} width={34} height={34} alt="" />
        </a>
        <span className="ptop-name" lang="en">VenGuard</span>
        <span className="ptop-actions">
          <ThemeToggle />
          <a href="#/account" className="ptop-profile" aria-label={t("profile")} aria-current={route.name === "account" ? "page" : undefined}>
            {initial || <Icon name="user" size={20} />}
          </a>
        </span>
      </header>

      <Notices />
      <div className="pcontent" id="content">
        {leak && !(route.name === "device" && route.id === leak) && <LeakBanner id={leak} />}
        {route.name === "home" && <PhoneHome />}
        {route.name === "alerts" && <History />}
        {route.name === "about" && <About />}
        {route.name === "device" && <PhoneDevice id={route.id} />}
        {route.name === "site" && <SiteScreen id={route.id} />}
        {route.name === "family" && <Family />}
        {route.name === "account" && <Account />}
        {route.name === "add" && <AddDevice />}
      </div>

      <nav className="pnav" aria-label="VenGuard">
        {TABS.map((x) => (
          <a key={x.tab} href={href({ name: x.tab })} aria-current={current === x.tab ? "page" : undefined}>
            <span className="pnav-icon">
              <Icon name={x.icon} />
              {x.tab === "alerts" && (hot || events.length > 0) && <i className={hot ? "badge badge--hot" : "badge"} />}
            </span>
            <span>{t(x.label)}</span>
          </a>
        ))}
      </nav>
      {mitigated && !leak && <MitigatedMessage id={mitigated} />}
    </div>
  );
}
