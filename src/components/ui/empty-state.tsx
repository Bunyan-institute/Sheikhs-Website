import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center bg-white border border-[#14262E]/10 rounded-2xl shadow-xs", className)}>
      <div className="w-14 h-14 rounded-2xl bg-[#EDF2EE] border border-[#BF9A45]/30 flex items-center justify-center mb-4">
        <div className="w-4 h-4 rounded-full bg-[#1D6A5A]" />
      </div>
      <h3 className="font-display text-xl font-semibold text-[#14262E] mb-2">{title}</h3>
      {description && (
        <p className="text-[#14262E]/70 text-sm max-w-md font-sans leading-relaxed">{description}</p>
      )}
    </div>
  );
}