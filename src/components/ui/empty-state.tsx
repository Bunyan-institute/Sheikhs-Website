import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center bg-white border border-[#0F241C]/10 rounded-2xl shadow-xs", className)}>
      <div className="w-14 h-14 rounded-2xl bg-[#EDF4F0] border border-[#BF9A45]/30 flex items-center justify-center mb-4">
        <div className="w-4 h-4 rounded-full bg-[#1B6A50]" />
      </div>
      <h3 className="font-display text-xl font-semibold text-[#0F241C] mb-2">{title}</h3>
      {description && (
        <p className="text-[#0F241C]/70 text-sm max-w-md font-sans leading-relaxed">{description}</p>
      )}
    </div>
  );
}