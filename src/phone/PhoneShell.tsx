/**
 * Android app layout: top bar (symbol, name, Day/Night and profile), the screen, and the orange bottom bar
 * (Home, Details, History, About us). The web app uses the shell in App.tsx instead.
 */
import { AlarmSheet } from "../components/AlarmSheet";
import { Icon, type IconName } from "../components/Icon";
import { ThemeToggle } from "../components/QuickSettings";
import { type Route, href } from "../lib/router";
import { statusOf } from "../lib/sim";
import { useApp } from "../lib/store";
import { useT } from "../lib/useT";
import { Account } from "../screens/Account";
import { AddDevice } from "../screens/AddDevice";
import { Family } from "../screens/Family";
import { SiteScreen } from "../screens/Site";
import { About } from "./About";
import { Details } from "./Details";
import { History } from "./History";
import { PhoneDevice } from "./PhoneDevice";
import { PhoneHome } from "./PhoneHome";

const BASE = import.meta.env.BASE_URL;

type Tab = "home" | "details" | "alerts" | "about";
const TABS: { tab: Tab; icon: IconName; label: "tabHome" | "tabDetails" | "tabHistory" | "tabAbout" }[] = [
  { tab: "home", icon: "home", label: "tabHome" },
  { tab: "details", icon: "activity", label: "tabDetails" },
  { tab: "alerts", icon: "history", label: "tabHistory" },
  { tab: "about", icon: "info", label: "tabAbout" },
];

/** Which bottom-bar item a screen belongs to (none for Profile and Family). */
function tabOf(r: Route): Tab | null {
  if (r.name === "device" || r.name === "site" || r.name === "add") return "home";
  if (r.name === "home" || r.name === "details" || r.name === "alerts" || r.name === "about") return r.name;
  return null;
}

export function PhoneShell({ route }: { route: Route }) {
  const { auth, mode, events, devices } = useApp();
  const { t } = useT();
  const current = tabOf(route);
  const hot = Object.values(devices).some((d) => statusOf(d) === "danger");
  const initial = mode === "live" && auth ? auth.who.replace(/^\+88/, "").charAt(0).toUpperCase() : "";

  return (
    <div className="pshell">
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

      <div className="pcontent" id="content">
        {route.name === "home" && <PhoneHome />}
        {route.name === "details" && <Details />}
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
      <AlarmSheet />
    </div>
  );
}
