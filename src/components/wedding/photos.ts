import { useSyncExternalStore } from "react";
import mainPhoto from "@/assets/img/last/preview/img_13.webp";
import welcomePhoto from "@/assets/img/last/preview/img_22.webp";

const originals = import.meta.glob<string>("/src/assets/img/last/*.webp", {
  eager: true, query: "?url", import: "default",
});
const previews = import.meta.glob<string>("/src/assets/img/last/preview/*.webp", {
  eager: true, query: "?url", import: "default",
});
const thumbnails = import.meta.glob<string>("/src/assets/img/last/thumbnail/*.webp", {
  eager: true, query: "?url", import: "default",
});

export const weddingPhotos = Object.entries(originals)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([file, full]) => {
    const name = file.slice(file.lastIndexOf("/") + 1);
    return {
      name, full,
      preview: previews[`/src/assets/img/last/preview/${name}`],
      thumbnail: thumbnails[`/src/assets/img/last/thumbnail/${name}`],
    };
  });

let ready: ReadonlySet<string> = new Set();
const listeners = new Set<() => void>();
let queue = weddingPhotos.map(photo => photo.full);
let active: string | undefined;
let started = false;

function loadImage(src: string, priority: "high" | "low") {
  return new Promise<boolean>(resolve => {
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = priority;
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });
}

// Keep only one large download in flight so small visible images stay responsive.
async function drainQueue() {
  if (active || !started) return;
  while (queue.length) {
    const src = queue.shift()!;
    if (ready.has(src)) continue;
    active = src;
    if (await loadImage(src, "low")) {
      ready = new Set([...ready, src]);
      listeners.forEach(listener => listener());
    }
    active = undefined;
  }
}

export function prioritizeWeddingPhoto(index: number) {
  const photo = weddingPhotos[index];
  if (!photo || ready.has(photo.full) || active === photo.full) return;
  queue = [photo.full, ...queue.filter(src => src !== photo.full)];
  void drainQueue();
}

export async function startWeddingPhotoDownloads() {
  if (started) return;
  // The HTML also preloads these URLs; the browser reuses those requests.
  await Promise.all([loadImage(mainPhoto, "high"), loadImage(welcomePhoto, "high")]);
  if (started) return;
  started = true;
  void drainQueue();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
const getSnapshot = () => ready;

export function useDownloadedWeddingPhotos() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
