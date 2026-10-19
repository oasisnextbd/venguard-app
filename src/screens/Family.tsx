import { type FormEvent, useState } from "react";
import { Icon } from "../components/Icon";
import { actions, useApp } from "../lib/store";
import { useT } from "../lib/useT";

const PHONE = /^01[3-9]\d{8}$/;

/** People who get an SMS when there is a leak (sent by the device's backend, not this phone). */
export function Family() {
  const { family } = useApp();
  const { t, n } = useT();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<"" | "nameMissing" | "phoneInvalid">("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const p = phone.replace(/[\s-]/g, "").replace(/^\+?88/, "");
    if (!name.trim()) return setError("nameMissing");
    if (!PHONE.test(p)) return setError("phoneInvalid");
    actions.addContact({ name: name.trim(), phone: p });
    setName("");
    setPhone("");
    setError("");
  };

  return (
    <main className="page">
      <h1 className="page-title">{t("familyTitle")}</h1>
      <p className="muted">{t("familyLeadPilot")}</p>
      {family.length > 0 && (
        <ul className="panel list">
          {family.map((c, i) => (
            <li key={`${c.phone}-${i}`}>
              <span className="avatar" aria-hidden="true">{c.name.slice(0, 1)}</span>
              <span className="list-text"><strong>{c.name}</strong><span className="num">{n(c.phone)}</span></span>
              <button type="button" className="icon-btn" onClick={() => actions.removeContact(i)} aria-label={`${t("remove")} ${c.name}`}><Icon name="x" size={18} /></button>
            </li>
          ))}
        </ul>
      )}
      {family.length < 3 ? (
        <form className="panel form" onSubmit={submit} noValidate>
          <label>{t("name")}<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={error === "nameMissing"} /></label>
          <label>{t("phone")}<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" aria-invalid={error === "phoneInvalid"} /></label>
          {error && <p className="error" role="alert">{t(error)}</p>}
          <button type="submit" className="btn btn--primary"><Icon name="plus" size={18} />{t("add")}</button>
        </form>
      ) : (
        <p className="small muted">{t("full")}</p>
      )}
    </main>
  );
}
