/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference lib="webworker" />
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_JWT_SOCKET_SECRET: string;
  readonly VITE_SERVICE_WORKER_PUBLIC: string;
  // more env variables...
}
