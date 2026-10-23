import versions from "./wedding-versions.json";

// Vercel serves a version-specific HTML document, including its share metadata.
// The hostname also supports the Vite development server without a rewrite.
const version = document.documentElement.dataset.weddingVersion === "v2"
  || window.location.hostname === "hwajinyu2.silee.net"
  ? "v2"
  : "v1";

export const wedding = versions[version];
