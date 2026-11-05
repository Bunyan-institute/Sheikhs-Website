"use client";

import { useEffect } from "react";

/**
 * Registers the admin service worker (scope: /admin) and
 * reloads once when a newer worker takes over so the app never runs against stale assets.
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let hadController = Boolean(navigator.serviceWorker.controller);
    let reloaded = false;
    const onControllerChange = () => {
      if (hadController && !reloaded) {
        reloaded = true;
        window.location.reload();
      }
      hadController = true;
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin" }).catch((err) => {
      console.warn("Admin service worker registration failed:", err);
    });

    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);

  return null;
}
