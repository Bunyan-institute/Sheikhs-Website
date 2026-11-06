"use client";

import { useId } from "react";

/** Shared control styling: 16px text (no iOS zoom), 44px tap height, brand focus ring. */
export const inputClass =
  "w-full min-h-11 rounded-lg border border-adm-border bg-white px-3 py-2.5 text-base text-adm-text placeholder:text-adm-muted/60 focus:border-adm-primary focus:outline-none focus:ring-2 focus:ring-adm-primary/25 disabled:opacity-60";
export const textareaClass = `${inputClass} leading-relaxed`;
export const selectClass = `${inputClass} appearance-none bg-[length:1.1rem] pe-9`;

export const buttonPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-adm-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-adm-primary-hover disabled:opacity-60";
export const buttonSecondary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-adm-border bg-white px-5 py-2.5 text-sm font-semibold text-adm-text hover:bg-adm-soft disabled:opacity-60";
export const buttonDanger =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-adm-danger px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Receives the generated id so the label is linked to the control. */
  children: React.ReactNode | ((id: string) => React.ReactNode);
}

export function FormField({ label, hint, error, required, children }: FormFieldProps) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-adm-text">
        {label}
        {required && <span className="ms-1 text-adm-danger">*</span>}
      </label>
      {typeof children === "function" ? children(id) : children}
      {hint && !error && <p className="text-xs text-adm-muted">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-medium text-adm-danger">
          {error}
        </p>
      )}
    </div>
  );
}
