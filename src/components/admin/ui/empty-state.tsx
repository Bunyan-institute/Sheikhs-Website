import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export function EmptyState({ icon: Icon = Inbox, title, hint, action }: { icon?: LucideIcon; title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-adm-border bg-white/60 px-6 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-adm-soft text-adm-primary">
        <Icon className="size-7" />
      </span>
      <p className="text-base font-bold text-adm-text">{title}</p>
      {hint && <p className="max-w-sm text-sm text-adm-muted">{hint}</p>}
      {action}
    </div>
  );
}
