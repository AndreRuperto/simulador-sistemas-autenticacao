/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly API_KEY: string;
    // adicione outras variáveis de ambiente aqui
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }