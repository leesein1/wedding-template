import { lazy, Suspense } from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const GallerySection = lazy(() => import("./sections/GallerySection"));

export default function LazyGallerySection({ debugClass = "" }: { debugClass?: string }) {
  const { ref, isVisible } = useRevealOnScroll({ rootMargin: "800px 0px", threshold: 0 });

  // Reserve space for the image, thumbnail strip, and section spacing.
  return (
    <section ref={ref} style={{ minHeight: "calc(min(100vw, 420px) * 1.533333 + 203px)" }}>
      {isVisible && (
        <Suspense fallback={null}>
          <GallerySection debugClass={debugClass} />
        </Suspense>
      )}
    </section>
  );
}
