import { useEffect, useRef, useState } from "react";

type Options = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
  once?: boolean; // 한번만 실행할지
};

export function useRevealOnScroll(options: Options = {}) {
  const {
    root = null,
    rootMargin = "0px 0px -15% 0px",
    threshold = 0.15,
    once = true,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { root, rootMargin, threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [root, rootMargin, threshold, once]);

  return { ref, isVisible };
}