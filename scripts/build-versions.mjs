import { readFile, writeFile } from "node:fs/promises";

const versions = JSON.parse(await readFile(new URL("../src/config/wedding-versions.json", import.meta.url), "utf8"));
const outputDirectory = new URL("../dist/", import.meta.url);
const original = await readFile(new URL("index.html", outputDirectory), "utf8");
const { v1, v2 } = versions;

// The share crawler must receive the right metadata before JavaScript runs.
const second = original
  .replace('<html lang="ko">', '<html lang="ko" data-wedding-version="v2">')
  .replaceAll(`${v1.url}${v1.shareImage}`, `${v2.url}${v2.shareImage}`)
  .replaceAll(v1.url, v2.url)
  .replace(/(<meta property="og:image:width" content=")\d+("\s*\/>)/, `$1${v2.shareImageWidth}$2`)
  .replace(/(<meta property="og:image:height" content=")\d+("\s*\/>)/, `$1${v2.shareImageHeight}$2`)
  .replace(/(<link\b(?=[^>]*\brel="preload")(?=[^>]*\bas="image")[^>]*\bhref=")[^"]+("[^>]*>)/, `$1${v2.heroImage}$2`);

if (second === original || !second.includes('data-wedding-version="v2"') || second.includes(v1.url)) {
  throw new Error("Could not generate the second invitation HTML");
}
await writeFile(new URL("index-v2.html", outputDirectory), second);
console.log("Generated index-v2.html with separate share metadata");
