import { type Key, digits, translate } from "./i18n";
import { useApp } from "./store";

/** Translation helper bound to the current language. */
export function useT() {
  const { lang } = useApp();
  const t = (key: Key, vars?: Record<string, string | number>) => translate(lang, key, vars);
  const n = (v: string | number) => digits(v, lang);
  return { t, n, lang };
}
