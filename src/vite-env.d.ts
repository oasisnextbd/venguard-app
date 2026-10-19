/// <reference types="vite/client" />
declare const __APP_VERSION__: string;
declare const __APP_BUILD__: number;
interface ImportMetaEnv {
  readonly VITE_FIREBASE_EMULATORS?: string;
}
