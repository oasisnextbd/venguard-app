import { type FormEvent, useState } from "react";
import { Icon } from "../components/Icon";
import { go } from "../lib/router";
import { useT } from "../lib/useT";

const ID = /^VG-[A-Z0-9]{4,12}$/;
const CODE = /^[A-Z0-9]{12}$/;

/** Live mode: add a device to this account with the ID and code from its sticker. */
export function AddDevice() {
  const { t } = useT();
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<"" | "idInvalid" | "codeInvalid" | "nameMissing" | "claimFailed">("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const did = id.trim().toUpperCase().replace(/\s/g, "");
    const dcode = code.trim().toUpperCase().replace(/[\s-]/g, "");
    if (!ID.test(did)) return setError("idInvalid");
    if (!CODE.test(dcode)) return setError("codeInvalid");
    if (!name.trim()) return setError("nameMissing");
    setBusy(true);
    setError("");
    try {
      const live = await import("../lib/live");
      await live.claimDevice(did, dcode, { name: name.trim().slice(0, 40), area: area.trim().slice(0, 40), kind: "home" });
      go({ name: "device", id: did });
    } catch {
      setError("claimFailed");
      setBusy(false);
    }
  };

  return (
    <main className="page">
      <a className="back" href="#/"><Icon name="back" size={20} />{t("back")}</a>
      <h1 className="page-title">{t("addDeviceTitle")}</h1>
      <p className="muted">{t("addDeviceLead")}</p>
      <form className="panel form" onSubmit={submit} noValidate>
        <label>{t("deviceId")}<input value={id} onChange={(e) => setId(e.target.value)} autoCapitalize="characters" autoComplete="off" placeholder="VG-0001A3" aria-invalid={error === "idInvalid"} /></label>
        <label>{t("stickerCode")}<input value={code} onChange={(e) => setCode(e.target.value)} autoCapitalize="characters" autoComplete="off" aria-invalid={error === "codeInvalid" || error === "claimFailed"} /></label>
        <label>{t("placeName")}<input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("placeNameHint")} aria-invalid={error === "nameMissing"} /></label>
        <label>{t("areaLabel")}<input value={area} onChange={(e) => setArea(e.target.value)} /></label>
        {error && <p className="error" role="alert">{t(error)}</p>}
        <button type="submit" className="btn btn--primary" disabled={busy}><Icon name="plus" size={18} />{busy ? t("loading") : t("addBtn")}</button>
      </form>
    </main>
  );
}
