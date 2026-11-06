"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

const FOCUSABLE = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Only the top-most modal reacts to Escape / Tab when several are open (e.g. a confirm over a form).
const stack: symbol[] = [];

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Confirm/prompt dialogs sit above regular sheets. */
  layer?: "base" | "top";
  dismissible?: boolean;
}

const sizeClass = { sm: "sm:max-w-md", md: "sm:max-w-xl", lg: "sm:max-w-3xl" } as const;

/** A bottom sheet on phones and a centred dialog on larger screens, with focus trap, Escape and scroll lock. */
export function Modal({ open, onClose, title, children, footer, size = "md", layer = "base", dismissible = true }: ModalProps) {
  const t = useTranslations("admin.common");
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const id = Symbol("modal");
    stack.push(id);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const initial =
      panel?.querySelector<HTMLElement>("[data-autofocus]") ??
      panel?.querySelector<HTMLElement>(`${FOCUSABLE.split(",").map((s) => `${s}:not([data-modal-close])`).join(",")}`);
    (initial ?? panel)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === "Escape" && dismissible) {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key === "Tab" && panel) {
        const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (items.length === 0) return e.preventDefault();
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      stack.splice(stack.indexOf(id), 1);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, dismissible]);

  if (!open) return null;

  return (
    <div className={`fixed inset-0 flex items-end justify-center sm:items-center sm:p-4 ${layer === "top" ? "z-[110]" : "z-[90]"}`}>
      <div className="absolute inset-0 bg-black/50" onClick={dismissible ? onClose : undefined} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative z-10 flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-adm-surface shadow-2xl outline-none sm:rounded-2xl ${sizeClass[size]}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-adm-border px-5 py-3.5">
          <h2 id={titleId} className="text-base font-bold text-adm-text">
            {title}
          </h2>
          <button
            type="button"
            data-modal-close
            onClick={onClose}
            aria-label={t("close")}
            className="grid size-10 shrink-0 place-items-center rounded-full text-adm-muted hover:bg-adm-soft"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2.5 border-t border-adm-border px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
