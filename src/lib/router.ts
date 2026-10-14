import { useEffect, useState } from "react";

/** Tiny hash router: #/, #/device/<id>, #/site/<id>, #/alerts, #/family, #/account. */
export type Route =
  | { name: "home" }
  | { name: "device"; id: string }
  | { name: "site"; id: string }
  | { name: "alerts" }
  | { name: "family" }
  | { name: "account" };

export function parse(hash: string): Route {
  const [, a, b] = hash.replace(/^#/, "").split("/");
  if (a === "device" && b) return { name: "device", id: decodeURIComponent(b) };
  if (a === "site" && b) return { name: "site", id: decodeURIComponent(b) };
  if (a === "alerts" || a === "family" || a === "account") return { name: a };
  return { name: "home" };
}

export function href(r: Route): string {
  return "id" in r ? `#/${r.name}/${encodeURIComponent(r.id)}` : r.name === "home" ? "#/" : `#/${r.name}`;
}

export function go(r: Route) {
  location.hash = href(r);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parse(location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
