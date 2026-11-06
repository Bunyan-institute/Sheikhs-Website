"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Modal } from "./modal";
import { buttonDanger, buttonPrimary, buttonSecondary, inputClass } from "./form-field";

type ToastKind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface PromptOptions {
  title?: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
}

type DialogState =
  | ({ type: "confirm"; resolve: (v: boolean) => void } & ConfirmOptions)
  | ({ type: "prompt"; resolve: (v: string | null) => void } & PromptOptions)
  | null;

interface Feedback {
  toast: { success: (m: string) => void; error: (m: string) => void; info: (m: string) => void };
  confirm: (opts: ConfirmOptions | string) => Promise<boolean>;
  prompt: (opts: PromptOptions | string) => Promise<string | null>;
}

const FeedbackContext = createContext<Feedback | null>(null);

export function useAdminFeedback(): Feedback {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useAdminFeedback must be used inside AdminFeedbackProvider");
  return ctx;
}

const icons = { success: CheckCircle2, error: XCircle, info: Info } as const;
const tones: Record<ToastKind, string> = {
  success: "border-adm-primary/40 bg-adm-soft text-adm-primary",
  error: "border-adm-danger/40 bg-adm-danger-soft text-adm-danger",
  info: "border-adm-border bg-white text-adm-text",
};

export function AdminFeedbackProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin.common");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [promptValue, setPromptValue] = useState("");
  const nextId = useRef(1);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), kind === "error" ? 7000 : 4000);
  }, []);

  const confirm = useCallback(
    (opts: ConfirmOptions | string) =>
      new Promise<boolean>((resolve) => {
        const o = typeof opts === "string" ? { message: opts } : opts;
        setDialog({ type: "confirm", resolve, danger: true, ...o });
      }),
    []
  );

  const prompt = useCallback(
    (opts: PromptOptions | string) =>
      new Promise<string | null>((resolve) => {
        const o = typeof opts === "string" ? { message: opts } : opts;
        setPromptValue(o.defaultValue ?? "");
        setDialog({ type: "prompt", resolve, ...o });
      }),
    []
  );

  const value = useMemo<Feedback>(
    () => ({
      toast: { success: (m) => push("success", m), error: (m) => push("error", m), info: (m) => push("info", m) },
      confirm,
      prompt,
    }),
    [push, confirm, prompt]
  );

  const close = (result: boolean | string | null) => {
    if (!dialog) return;
    if (dialog.type === "confirm") dialog.resolve(Boolean(result));
    else dialog.resolve(typeof result === "string" ? result : null);
    setDialog(null);
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <div className="fixed end-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 md:bottom-4" aria-live="polite">
        {toasts.map((toastItem) => {
          const Icon = icons[toastItem.kind];
          return (
            <div key={toastItem.id} role={toastItem.kind === "error" ? "alert" : "status"} className={`flex items-start gap-2.5 rounded-md border px-3.5 py-3 text-sm shadow-lg ${tones[toastItem.kind]}`}>
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="flex-1 break-words">{toastItem.message}</p>
              <button type="button" aria-label={t("close")} onClick={() => setToasts((prev) => prev.filter((x) => x.id !== toastItem.id))} className="opacity-60 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {dialog && (
        <Modal
          open
          layer="top"
          size="sm"
          title={dialog.title ?? (dialog.type === "confirm" ? t("confirm") : t("ok"))}
          onClose={() => close(dialog.type === "confirm" ? false : null)}
          footer={
            <>
              <button type="button" onClick={() => close(dialog.type === "confirm" ? false : null)} className={buttonSecondary}>
                {(dialog.type === "confirm" && dialog.cancelLabel) || t("cancel")}
              </button>
              <button
                type="button"
                data-autofocus={dialog.type === "confirm" ? "" : undefined}
                onClick={() => close(dialog.type === "confirm" ? true : promptValue)}
                className={dialog.type === "confirm" && dialog.danger ? buttonDanger : buttonPrimary}
              >
                {dialog.confirmLabel || (dialog.type === "confirm" && dialog.danger ? t("delete") : t("ok"))}
              </button>
            </>
          }
        >
          <div className="flex items-start gap-3">
            {dialog.type === "confirm" && dialog.danger && <AlertTriangle className="mt-0.5 size-5 shrink-0 text-adm-danger" />}
            <div className="min-w-0 flex-1">
              <p className="whitespace-pre-line text-base text-adm-text">{dialog.message}</p>
              {dialog.type === "prompt" && (
                <input
                  data-autofocus
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && close(promptValue)}
                  placeholder={dialog.placeholder}
                  className={`${inputClass} mt-3`}
                />
              )}
            </div>
          </div>
        </Modal>
      )}
    </FeedbackContext.Provider>
  );
}
