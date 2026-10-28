"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: all content stays visible without JavaScript. */
export default function SiteMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".section-intro, .service-row, .project, .precision-copy, .human-grid, .method li, .area > div, .contact-band > div, .split-content > div, .article-grid article, .contact-aside, .contact-layout form",
      ),
    );
    let observer: IntersectionObserver | undefined;
    const showAll = () =>
      elements.forEach((el) => {
        el.removeAttribute("data-reveal");
        el.style.removeProperty("--reveal-delay");
      });
    if (!reduced.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).dataset.reveal = "visible";
              observer?.unobserve(entry.target);
            }
          }),
        { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
      );
      elements.forEach((el, i) => {
        el.style.setProperty("--reveal-delay", `${(i % 3) * 65}ms`);
        el.dataset.reveal = "pending";
        observer!.observe(el);
      });
    }
    const onPreference = () => {
      if (reduced.matches) {
        observer?.disconnect();
        showAll();
      }
    };
    reduced.addEventListener("change", onPreference);
    const onPointer = (event: PointerEvent) => {
      if (
        reduced.matches ||
        !pointer.matches ||
        !(event.target instanceof Element)
      )
        return;
      const card = (event.target as Element).closest<HTMLElement>(
        ".service-row, .territory-map, .contact-band",
      );
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      observer?.disconnect();
      showAll();
      reduced.removeEventListener("change", onPreference);
      document.removeEventListener("pointermove", onPointer);
    };
  }, [pathname]);
  return null;
}
