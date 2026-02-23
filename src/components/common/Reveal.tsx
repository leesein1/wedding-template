import type { ReactNode } from "react";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

type RevealProps = {
  children: ReactNode;
  className?: string;
  once?: boolean;
  delayMs?: number;
};

export default function Reveal({
  children,
  className = "",
  once = false,
  delayMs = 0,
}: RevealProps) {
  const { ref, isVisible } = useRevealOnScroll({ once });

  return (
    <section
      ref={ref as any}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : "translateY(14px)",
        transition: "opacity 700ms ease, transform 700ms ease",
        transitionDelay: `${delayMs}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </section>
  );
}