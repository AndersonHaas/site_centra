"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 1024px) and (min-height: 600px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(callback: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

// The server and the first hydration render use the readable, static layout.
// Heavy interactive components are mounted only on suitable desktop devices.
export function useDesktopMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
