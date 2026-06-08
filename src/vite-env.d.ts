/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

interface Window {
  PaystackPop: {
    setup: (config: Record<string, unknown>) => { openIframe: () => void };
  };
}
