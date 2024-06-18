/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_JWT_SOCKET_SECRET: string;
  // more env variables...
}
