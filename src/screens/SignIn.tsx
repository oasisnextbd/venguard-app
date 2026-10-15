import { type FormEvent, useState } from "react";
import { Logo } from "../components/Logo";
import { actions } from "../lib/store";
import { useT } from "../lib/useT";

const PHONE = /^01[3-9]\d{8}$/;
type ErrorKey = "wrongCode" | "tooMany" | "badPhone" | "notAllowed" | "signInFailed";

/** Phone-number sign-in for live mode (Firebase Auth). */
export function SignIn() {
  const { t, n } = useT();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorKey | "">("");
  const [detail, setDetail] = useState(""); // Firebase error code, shown small to help support

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const p = phone.replace(/[\s-]/g, "").replace(/^\+?88/, "");
    if (!PHONE.test(p)) return setError("badPhone");
    setBusy(true);
    setError("");
    setDetail("");
    const live = await import("../lib/live");
    try {
      await live.sendCode(p, "send-code");
      setPhone(p);
      setStep("code");
    } catch (err) {
      setError(live.errorKey(err));
      setDetail((err as { code?: string })?.code || "");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setDetail("");
    const live = await import("../lib/live");
    try {
      await live.confirmCode(code.trim());
    } catch (err) {
      setError(live.errorKey(err));
      setDetail((err as { code?: string })?.code || "");
      setBusy(false);
    }
  };

  return (
    <main className="welcome">
      <div className="welcome-inner">
        <Logo size={36} />
        <h1>{t("signInTitle")}</h1>
        {step === "phone" ? (
          <form className="form stretch" onSubmit={send} noValidate>
            <p className="muted">{t("signInLead")}</p>
            <label>{t("phone")}<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" aria-invalid={error === "badPhone"} /></label>
            {error && <p className="error" role="alert">{t(error)}{detail && <span className="error-code">{detail}</span>}</p>}
            <button id="send-code" type="submit" className="btn btn--primary btn--block" disabled={busy}>{busy ? t("loading") : t("sendCode")}</button>
          </form>
        ) : (
          <form className="form stretch" onSubmit={verify} noValidate>
            <p className="muted">{t("codeSentTo", { phone: n(phone) })}</p>
            <label>{t("codeLabel")}<input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" aria-invalid={error === "wrongCode"} /></label>
            {error && <p className="error" role="alert">{t(error)}{detail && <span className="error-code">{detail}</span>}</p>}
            <button type="submit" className="btn btn--primary btn--block" disabled={busy || code.length !== 6}>{busy ? t("loading") : t("verify")}</button>
            <button type="button" className="btn btn--ghost btn--block" onClick={() => { setStep("phone"); setCode(""); setError(""); }}>{t("changeNumber")}</button>
          </form>
        )}
        <p className="small muted">{t("pilotNote")}</p>
        <button type="button" className="link-btn" onClick={actions.switchToDemo}>{t("switchDemo")}</button>
      </div>
    </main>
  );
}
