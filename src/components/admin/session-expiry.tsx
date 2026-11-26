"use client";
import { useEffect } from "react";

/** Absolute 30-day expiry, including an app left open or resumed after the phone sleeps. */
export function SessionExpiry({ expiresAt }: { expiresAt: number }) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let expiring = false;
    const check = () => {
      clearTimeout(timer);
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        if (expiring) return;
        expiring = true;
        const redirect = () => window.location.replace("/admin/login");
        // Revoke the server session too, and keep the login screen reachable when offline.
        Promise.race([fetch("/api/admin/logout", { method: "POST" }), new Promise((resolve) => setTimeout(resolve, 3000))]).then(redirect, redirect);
        return;
      }
      // Browsers cap a single timeout at ~24.8 days, so check the deadline in bounded intervals.
      timer = setTimeout(check, Math.min(remaining, 60 * 60 * 1000));
    };
    check();
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [expiresAt]);
  return null;
}
