"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Opens a page's "create" form when it is reached through the "+" sheet or an app shortcut (?new=1). */
export function useOpenNewFromQuery(open: () => void) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handled = useRef(false);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    if (handled.current || params.get("new") !== "1") return;
    handled.current = true;
    openRef.current();
    router.replace(pathname);
  }, [params, router, pathname]);
}
