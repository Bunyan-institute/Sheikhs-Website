"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { deleteCourseExamAction, getCourseExamAction, saveCourseExamAction } from "../actions";

interface QuestionDraft {
  id?: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

const blankQuestion = (): QuestionDraft => ({ question: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" });
const field = "w-full px-2.5 py-1.5 border border-[#E0D8CE] rounded bg-white focus:outline-none focus:border-[#1B5E20]";

export function ExamEditorModal({ courseSlug, courseTitle, onClose }: { courseSlug: string; courseTitle: string; onClose: () => void }) {
  const { toast, confirm } = useAdminFeedback();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasExam, setHasExam] = useState(false);
  const [passing, setPassing] = useState(70);
  const [questions, setQuestions] = useState<QuestionDraft[]>([blankQuestion()]);

  useEffect(() => {
    getCourseExamAction(courseSlug)
      .then((exam) => {
        if (exam) {
          setHasExam(true);
          setPassing(exam.passingPercentage);
          setQuestions(exam.questions.map((q) => ({ id: q.id, question: q.question, options: q.options, correctOptionIndex: q.correctOptionIndex, explanation: q.explanation ?? "" })));
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug]);

  const patch = (i: number, p: Partial<QuestionDraft>) => setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...p } : q)));

  const save = async () => {
    setSaving(true);
    try {
      const res = await saveCourseExamAction(courseSlug, { passingPercentage: passing, questions });
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      toast.success("Exam saved");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save exam");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!(await confirm({ message: "Delete this exam? Students will no longer be able to sit it." }))) return;
    try {
      await deleteCourseExamAction(courseSlug);
      toast.success("Exam deleted");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete exam");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col z-10 border border-[#E0D8CE]">
        <div className="p-4 border-b border-[#E0D8CE] flex items-center justify-between bg-[#FAF8F5]">
          <h3 className="font-bold text-sm text-[#2D3436]">Exam — {courseTitle}</h3>
          <button onClick={onClose} aria-label="Close" className="text-[#636E72]"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {loading ? (
            <div className="py-10 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-[#1B5E20]" /></div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <label className="font-bold text-[#2D3436]" htmlFor="passing">Passing score (%)</label>
                <input id="passing" type="number" min={1} max={100} value={passing} onChange={(e) => setPassing(Number(e.target.value))} className={`${field} !w-24`} />
              </div>

              {questions.map((q, i) => (
                <fieldset key={q.id ?? i} className="border border-[#E0D8CE] rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <legend className="font-bold text-[#2D3436] px-1">Question {i + 1}</legend>
                    <button type="button" aria-label={`Remove question ${i + 1}`} onClick={() => setQuestions((qs) => qs.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <textarea rows={2} className={field} placeholder="Question text" value={q.question} onChange={(e) => patch(i, { question: e.target.value })} />
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input type="radio" name={`correct-${i}`} aria-label={`Option ${oi + 1} is correct`} checked={q.correctOptionIndex === oi} onChange={() => patch(i, { correctOptionIndex: oi })} className="accent-[#1B5E20]" />
                      <input className={field} placeholder={`Option ${oi + 1}`} value={opt} onChange={(e) => patch(i, { options: q.options.map((o, idx) => (idx === oi ? e.target.value : o)) })} />
                    </div>
                  ))}
                  <input className={field} placeholder="Explanation shown to the admin only (optional)" value={q.explanation} onChange={(e) => patch(i, { explanation: e.target.value })} />
                </fieldset>
              ))}

              <button type="button" onClick={() => setQuestions((qs) => [...qs, blankQuestion()])} className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-[#1B5E20] text-[#1B5E20] font-semibold hover:bg-[#E8F5E9]">
                <Plus className="w-3.5 h-3.5" /> Add question
              </button>
            </>
          )}
        </div>

        <div className="p-4 border-t border-[#E0D8CE] flex items-center justify-between">
          <div>{hasExam && <button type="button" onClick={remove} className="px-3 py-2 rounded text-red-600 hover:bg-red-50 font-semibold text-xs">Delete exam</button>}</div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#E0D8CE] rounded text-[#636E72] text-xs">Cancel</button>
            <button type="button" disabled={saving || loading} onClick={save} className="px-4 py-2 rounded bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs disabled:opacity-60">
              {saving ? "Saving…" : "Save exam"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
