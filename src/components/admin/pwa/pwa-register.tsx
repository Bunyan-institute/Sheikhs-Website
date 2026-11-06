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

    // ?dev=1 keeps hot reload working: the worker still handles push but never caches assets there.
    const script = process.env.NODE_ENV === "production" ? "/admin-sw.js" : "/admin-sw.js?dev=1";
    navigator.serviceWorker.register(script, { scope: "/admin" }).catch((err) => {
      console.warn("Admin service worker registration failed:", err);
    });

    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);

  return null;
}
