import { readFile, writeFile } from "node:fs/promises";

const versions = JSON.parse(await readFile(new URL("../src/config/wedding-versions.json", import.meta.url), "utf8"));
const outputDirectory = new URL("../dist/", import.meta.url);
const original = await readFile(new URL("index.html", outputDirectory), "utf8");
const { v1 } = versions;

// The share crawler must receive the right metadata before JavaScript runs.
for (const [version, config] of Object.entries(versions)) {
  if (version === "v1") continue;
  const html = original
    .replace('<html lang="ko">', `<html lang="ko" data-wedding-version="${version}">`)
    .replaceAll(`${v1.url}${v1.shareImage}`, `${config.url}${config.shareImage}`)
    .replaceAll(v1.url, config.url)
    .replace(/(<meta property="og:image:width" content=")\d+("\s*\/>)/, `$1${config.shareImageWidth}$2`)
    .replace(/(<meta property="og:image:height" content=")\d+("\s*\/>)/, `$1${config.shareImageHeight}$2`)
    .replace(/(<link\b(?=[^>]*\brel="preload")(?=[^>]*\bas="image")[^>]*\bhref=")[^"]+("[^>]*>)/, (match, before, after) =>
      config.heroImage ? `${before}${config.heroImage}${after}` : match);

  if (html === original || !html.includes(`data-wedding-version="${version}"`) || html.includes(`content="${v1.url}`)) {
    throw new Error(`Could not generate the ${version} invitation HTML`);
  }
  await writeFile(new URL(`index-${version}.html`, outputDirectory), html);
  console.log(`Generated index-${version}.html with separate share metadata`);
}
