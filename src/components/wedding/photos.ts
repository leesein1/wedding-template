const previews = import.meta.glob<string>("/src/assets/img/last/preview/*.webp", {
  eager: true, query: "?url", import: "default",
});
const thumbnails = import.meta.glob<string>("/src/assets/img/last/thumbnail/*.webp", {
  eager: true, query: "?url", import: "default",
});

export const weddingPhotos = Object.entries(previews)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([file, preview]) => {
    const name = file.slice(file.lastIndexOf("/") + 1);
    return {
      name, preview,
      thumbnail: thumbnails[`/src/assets/img/last/thumbnail/${name}`],
    };
  });
