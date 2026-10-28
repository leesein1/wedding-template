import versions from "./wedding-versions.json";

// index.html resolves the hostname before the first paint. Reuse that same flag
// for every section so the loading cover and the hero can never choose separately.
const selectedVersion = document.documentElement.dataset.weddingVersion;
const version = selectedVersion === "v2" || selectedVersion === "v3"
  ? selectedVersion
  : "v1";

export const wedding = versions[version];

// These invitation participants all have a one-character Korean surname.
const displayName = (name: string) => wedding.omitSurnames ? name.slice(1) : name;
export const people = {
  groom: displayName("이세인"),
  bride: displayName("유화진"),
  groomFather: displayName("이상권"),
  groomMother: displayName("박선욱"),
  brideFather: displayName(wedding.brideFather.name),
  brideMother: displayName(wedding.brideMother.name),
};
