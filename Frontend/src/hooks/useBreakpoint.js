// src/hooks/useBreakpoint.js
// Returns true when viewport width is <= maxWidth.
// Usage:  const isMobile = useBreakpoint(768);

import { useState, useEffect } from "react";

export function useBreakpoint(maxWidth = 768) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= maxWidth
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, [maxWidth]);

  return matches;
}