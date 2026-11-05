"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

export interface LessonDraft {
  id?: string;
  title: string;
  summary: string;
  durationMinutes: number;
}

const input = "w-full px-2.5 py-1.5 border border-[#E0D8CE] rounded bg-white focus:outline-none focus:border-[#1B5E20]";

export function LessonsEditor({ lessons, onChange }: { lessons: LessonDraft[]; onChange: (l: LessonDraft[]) => void }) {
  const update = (i: number, patch: Partial<LessonDraft>) => onChange(lessons.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const move = (i: number, delta: number) => {
    const j = i + delta;
    if (j < 0 || j >= lessons.length) return;
    const next = [...lessons];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-bold text-[#2D3436]">Lessons ({lessons.length})</label>
        <button
          type="button"
          onClick={() => onChange([...lessons, { title: "", summary: "", durationMinutes: 0 }])}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#1B5E20] text-[#1B5E20] font-semibold hover:bg-[#E8F5E9]"
        >
          <Plus className="w-3.5 h-3.5" /> Add lesson
        </button>
      </div>
      {lessons.length === 0 && <p className="text-[#636E72]">No lessons yet.</p>}
      <ol className="space-y-2">
        {lessons.map((l, i) => (
          <li key={l.id ?? i} className="border border-[#E0D8CE] rounded p-2.5 bg-[#FAF8F5]/40">
            <div className="flex items-center gap-2">
              <span className="w-6 text-center font-bold text-[#636E72]">{i + 1}</span>
              <input aria-label={`Lesson ${i + 1} title`} className={input} placeholder="Lesson title" value={l.title} onChange={(e) => update(i, { title: e.target.value })} />
              <input aria-label="Minutes" type="number" min={0} className={`${input} !w-20`} placeholder="min" value={l.durationMinutes || ""} onChange={(e) => update(i, { durationMinutes: Number(e.target.value) })} />
              <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="p-1 text-[#636E72] hover:text-[#1B5E20]"><ArrowUp className="w-4 h-4" /></button>
              <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="p-1 text-[#636E72] hover:text-[#1B5E20]"><ArrowDown className="w-4 h-4" /></button>
              <button type="button" aria-label="Remove lesson" onClick={() => onChange(lessons.filter((_, idx) => idx !== i))} className="p-1 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
            </div>
            <input aria-label={`Lesson ${i + 1} summary`} className={`${input} mt-2`} placeholder="Short summary (optional)" value={l.summary} onChange={(e) => update(i, { summary: e.target.value })} />
          </li>
        ))}
      </ol>
    </div>
  );
}
