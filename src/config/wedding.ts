import versions from "./wedding-versions.json";

// index.html resolves the hostname before the first paint. Reuse that same flag
// for every section so the loading cover and the hero can never choose separately.
const version = document.documentElement.dataset.weddingVersion === "v2"
  ? "v2"
  : "v1";

export const wedding = versions[version];
