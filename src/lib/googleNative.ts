/**
 * Native "Continue with Google" for the Android app (android/app/src/main/java/com/oasisnext/venguard/
 * GoogleSignInPlugin.java). Returns a Google ID token for Firebase; rejects with code "CANCELED" when the
 * person closes the account picker, "NO_ACCOUNT" when the phone has no Google account.
 */
import { registerPlugin } from "@capacitor/core";

export const GoogleSignIn = registerPlugin<{
  signIn(options: { serverClientId: string }): Promise<{ idToken: string }>;
}>("GoogleSignIn");
