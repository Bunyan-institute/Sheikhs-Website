"use client";

import { useCallback } from "react";

export function useLogout() {
  return useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.href = "/admin/login";
    }
  }, []);
}
