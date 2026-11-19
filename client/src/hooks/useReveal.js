import { useEffect } from "react";

/**
 * Adds `is-visible` to every `.reveal` element once it scrolls into view.
 * Re-scans when `deps` change so content loaded after mount is picked up.
 */
export default function useReveal(deps = []) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
