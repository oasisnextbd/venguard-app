import { type FormEvent, useState } from "react";
import { Logo } from "../components/Logo";
import { CornerSettings } from "../components/QuickSettings";
import type { ErrorKey } from "../lib/live";
import { isNative } from "../lib/platform";
import { useT } from "../lib/useT";

const PHONE = /^01[3-9]\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

type View = "email" | "create" | "forgot" | "phone" | "code";

/**
 * Sign-in (Firebase Auth). Google and email + password are free on the Spark plan;
 * phone works only with the console's test numbers until an SMS plan is added.
 * Inside the Android app Google is hidden (see live.ts).
 */
export function SignIn() {
  const { t, n } = useT();
  const [view, setView] = useState<View>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorKey | "">("");
  const [detail, setDetail] = useState(""); // Firebase error code, shown small to help support
  const [resetSent, setResetSent] = useState(false);

  const go = (v: View) => {
    setView(v);
    setError("");
    setDetail("");
    setResetSent(false);
  };

  /** Run one Firebase call with the busy flag and error display. Success is seen by live.ts. */
  const run = async (fn: (live: typeof import("../lib/live")) => Promise<void>) => {
    setBusy(true);
    setError("");
    setDetail("");
    const live = await import("../lib/live");
    try {
      await fn(live);
    } catch (err) {
      const key = live.errorKey(err);
      if (key !== "cancelled") {
        setError(key);
        setDetail((err as { code?: string })?.code || "");
      }
    } finally {
      setBusy(false);
    }
  };

  const google = () => run((live) => live.signInGoogle());

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    const address = email.trim();
    if (!EMAIL.test(address)) return setError("badEmail");
    if (view === "forgot") {
      return run(async (live) => {
        await live.resetPassword(address);
        setResetSent(true);
      });
    }
    if (view === "create" && password.length < MIN_PASSWORD) return setError("weakPassword");
    if (!password) return setError("wrongPassword");
    return run((live) => (view === "create" ? live.createAccount(address, password) : live.signInEmail(address, password)));
  };

  const sendCode = (e: FormEvent) => {
    e.preventDefault();
    const p = phone.replace(/[\s-]/g, "").replace(/^\+?88/, "");
    if (!PHONE.test(p)) return setError("badPhone");
    return run(async (live) => {
      await live.sendCode(p, "recaptcha-box");
      setPhone(p);
      setView("code");
    });
  };

  const verify = (e: FormEvent) => {
    e.preventDefault();
    return run((live) => live.confirmCode(code.trim()));
  };

  const errorLine = error && (
    <p className="error" role="alert">{t(error)}{detail && <span className="error-code">{detail}</span>}</p>
  );
  const emailView = view === "email" || view === "create" || view === "forgot";

  return (
    <main className="welcome">
      <CornerSettings />
      <div className="welcome-inner">
        <Logo height={40} />
        <h1>{t(view === "create" ? "createTitle" : view === "forgot" ? "forgotTitle" : "signInTitle")}</h1>

        {emailView && view !== "forgot" && (
          <div className="stretch signin-alt">
            {isNative ? (
              <p className="small muted">{t("googleLater")}</p>
            ) : (
              <>
                <button type="button" className="btn btn--google btn--block" onClick={google} disabled={busy}>
                  <GoogleMark />{t("continueGoogle")}
                </button>
                <p className="or"><span>{t("orEmail")}</span></p>
              </>
            )}
          </div>
        )}

        {emailView && (
          <form key={view} className="form stretch" onSubmit={submitEmail} noValidate>
            {view === "forgot" && <p className="muted">{t("forgotLead")}</p>}
            <label>{t("email")}<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" aria-invalid={error === "badEmail"} /></label>
            {view !== "forgot" && (
              <label>
                {t("password")}
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={view === "create" ? "new-password" : "current-password"} aria-invalid={error === "wrongPassword" || error === "weakPassword"} />
                {view === "create" && <span className="hint">{t("passwordHint", { n: n(MIN_PASSWORD) })}</span>}
              </label>
            )}
            {errorLine}
            {resetSent && <p className="ok-note" role="status">{t("resetSent", { email: email.trim() })}</p>}
            <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
              {busy ? t("loading") : t(view === "create" ? "createBtn" : view === "forgot" ? "sendReset" : "signInBtn")}
            </button>
            <div className="signin-links">
              {view === "email" && <button type="button" className="link-btn" onClick={() => go("forgot")}>{t("forgotLink")}</button>}
              {view === "email" && <button type="button" className="link-btn" onClick={() => go("create")}>{t("createLink")}</button>}
              {view !== "email" && <button type="button" className="link-btn" onClick={() => go("email")}>{t("haveAccount")}</button>}
            </div>
          </form>
        )}

        {view === "phone" && (
          <form key="phone" className="form stretch" onSubmit={sendCode} noValidate>
            <p className="muted">{t("signInLead")}</p>
            <label>{t("phone")}<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" aria-invalid={error === "badPhone"} /></label>
            {errorLine}
            <button type="submit" className="btn btn--primary btn--block" disabled={busy}>{busy ? t("loading") : t("sendCode")}</button>
            <p className="small muted">{t("pilotNote")}</p>
          </form>
        )}

        {view === "code" && (
          <form key="code" className="form stretch" onSubmit={verify} noValidate>
            <p className="muted">{t("codeSentTo", { phone: n(phone) })}</p>
            <label>{t("codeLabel")}<input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" aria-invalid={error === "wrongCode"} /></label>
            {errorLine}
            <button type="submit" className="btn btn--primary btn--block" disabled={busy || code.length !== 6}>{busy ? t("loading") : t("verify")}</button>
            <button type="button" className="btn btn--ghost btn--block" onClick={() => { go("phone"); setCode(""); }}>{t("changeNumber")}</button>
          </form>
        )}

        {/* Invisible reCAPTCHA lives in its own box, never on a button: a button-bound widget keeps
            intercepting clicks after React reuses that button for the next step. */}
        <div id="recaptcha-box" />
        {emailView
          ? <button type="button" className="link-btn" onClick={() => go("phone")}>{t("usePhone")}</button>
          : <button type="button" className="link-btn" onClick={() => go("email")}>{t("useEmail")}</button>}
      </div>
    </main>
  );
}

/** Google's "G" mark, as its sign-in button guidelines ask. */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
