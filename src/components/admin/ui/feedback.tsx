"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

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
  success: "border-[#1B5E20]/40 bg-[#E8F5E9] text-[#1B5E20]",
  error: "border-[#C62828]/40 bg-[#FDECEA] text-[#C62828]",
  info: "border-[#0D3E2F]/30 bg-white text-[#0D3E2F]",
};

export function AdminFeedbackProvider({ children }: { children: React.ReactNode }) {
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

      <div className="fixed bottom-4 end-4 z-[100] flex flex-col gap-2 w-[min(24rem,calc(100vw-2rem))]" aria-live="polite">
        {toasts.map((t) => {
          const Icon = icons[t.kind];
          return (
            <div key={t.id} role={t.kind === "error" ? "alert" : "status"} className={`flex items-start gap-2.5 rounded-md border px-3.5 py-3 text-sm shadow-lg ${tones[t.kind]}`}>
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="flex-1 break-words">{t.message}</p>
              <button type="button" aria-label="Dismiss" onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="opacity-60 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {dialog && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50" onMouseDown={(e) => e.target === e.currentTarget && close(dialog.type === "confirm" ? false : null)}>
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl border border-[#E0D8CE]">
            <div className="flex items-start gap-3">
              {dialog.type === "confirm" && dialog.danger && <AlertTriangle className="w-5 h-5 text-[#C62828] mt-0.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                {dialog.title && <h2 className="font-bold text-[#2D3436] mb-1">{dialog.title}</h2>}
                <p className="text-sm text-[#2D3436] whitespace-pre-line">{dialog.message}</p>
                {dialog.type === "prompt" && (
                  <input
                    autoFocus
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && close(promptValue)}
                    placeholder={dialog.placeholder}
                    className="mt-3 w-full px-3 py-2 border border-[#E0D8CE] rounded bg-white text-sm focus:outline-none focus:border-[#1B5E20]"
                  />
                )}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2.5">
              <button type="button" onClick={() => close(dialog.type === "confirm" ? false : null)} className="px-4 py-2 rounded border border-[#E0D8CE] text-sm font-semibold text-[#2D3436] hover:bg-[#F7F5F0]">
                {(dialog.type === "confirm" && dialog.cancelLabel) || "Cancel"}
              </button>
              <button
                type="button"
                autoFocus={dialog.type === "confirm"}
                onClick={() => close(dialog.type === "confirm" ? true : promptValue)}
                className={`px-4 py-2 rounded text-sm font-semibold text-white ${dialog.type === "confirm" && dialog.danger ? "bg-[#C62828] hover:bg-[#a52121]" : "bg-[#1B5E20] hover:bg-[#154a19]"}`}
              >
                {dialog.confirmLabel || (dialog.type === "confirm" && dialog.danger ? "Delete" : "OK")}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}
