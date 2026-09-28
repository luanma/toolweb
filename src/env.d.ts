/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_AMAP_KEY: string;
  readonly PUBLIC_AMAP_SECURITY_CODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}