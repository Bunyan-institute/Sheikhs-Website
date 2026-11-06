"use client";

import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  /** Button content and accessible name. */
  trigger: React.ReactNode;
  label: string;
  children: (close: () => void) => React.ReactNode;
  width?: string;
}

/** A small popover menu: closes on outside click or Escape, items are 44px tall. */
export function Dropdown({ trigger, label, children, width = "w-60" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-adm-text hover:bg-adm-soft"
      >
        {trigger}
      </button>
      {open && (
        <div role="menu" className={`absolute end-0 top-full z-50 mt-1 ${width} overflow-hidden rounded-xl border border-adm-border bg-white py-1 shadow-xl`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export const menuItemClass =
  "flex min-h-11 w-full items-center gap-3 px-4 py-2.5 text-start text-sm text-adm-text hover:bg-adm-soft";
