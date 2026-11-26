"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, FileUp, Loader2, Download } from "lucide-react";
import { deleteEventTestAction, getEventTestAction, importEventTestAction } from "../actions";
import type { PublicEvent } from "@/lib/api/types";

export function TestsClient({ events }: { events: PublicEvent[] }) {
  const [slug, setSlug] = useState(events[0]?.slug ?? "");
  const [fileText, setFileText] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [hasTest, setHasTest] = useState(false);
  useEffect(() => { if (slug) getEventTestAction(slug).then((test) => setHasTest(!!test)).catch(() => setHasTest(false)); }, [slug]);
  const importFile = async (file?: File) => {
    if (!file) return;
    setStatus("");
    if (file.size > 1_000_000) { setStatus("Choose a JSON file smaller than 1 MB."); return; }
    try { setFileText(await file.text()); } catch { setStatus("Could not read that file."); }
  };
  const submit = async () => {
    if (!slug || !fileText) { setStatus("Choose an event and a JSON test file first."); return; }
    setBusy(true); setStatus("");
    try {
      const result = await importEventTestAction(slug, fileText);
      if (!result.success) throw new Error(result.error);
      setHasTest(true); setStatus(`Imported ${result.count} questions for /events/${result.eventSlug}/test.`);
    } catch (e) { setStatus(e instanceof Error ? e.message : "Import failed."); }
    finally { setBusy(false); }
  };
  const remove = async () => { if (!slug || !window.confirm("Remove the test attached to this event?")) return; const result = await deleteEventTestAction(slug); setHasTest(false); setStatus(result.success ? "Test removed from this event." : "No test was attached to this event."); };
  return <main className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
    <header><h1 className="text-2xl font-bold text-[#2D3436]">Event tests</h1><p className="mt-1 text-sm text-[#636E72]">Attach a timed assessment to any event by importing a JSON question file.</p></header>
    <section className="space-y-5 rounded-xl border border-[#E0D8CE] bg-white p-5 shadow-sm sm:p-6">
      <label className="block text-sm font-semibold text-[#2D3436]">Event
        <select value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-2 block min-h-11 w-full rounded-lg border border-[#D7D0C5] bg-white px-3 text-sm" disabled={!events.length}>
          {events.map((event) => <option key={event.id} value={event.slug}>{event.title} · {event.slug}</option>)}
        </select>
      </label>
      {hasTest && <p className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="size-4"/>A test is attached. Importing another file replaces its question set.</p>}
      <div className="rounded-lg border border-dashed border-[#BF9A45] bg-[#FCFAF6] p-5">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#1B6A50]"><FileUp className="size-5"/>Choose test JSON file<input type="file" accept=".json,application/json" className="sr-only" onChange={(e) => importFile(e.target.files?.[0])}/></label>
        {fileText && <p className="mt-3 text-xs text-[#636E72]">File loaded ({new Blob([fileText]).size.toLocaleString()} bytes)</p>}
        <a href="/samples/event-test.sample.json" download className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#1B6A50] underline"><Download className="size-3.5"/>Download sample test JSON</a>
      </div>
      <details><summary className="cursor-pointer text-sm font-semibold text-[#2D3436]">Expected JSON format</summary><pre className="mt-3 overflow-auto rounded-lg bg-[#F5F1EB] p-3 text-xs">{`{
  "passing_percentage": 70,
  "questions": [
    { "question": "Question text", "options": ["A", "B"], "correct_option_index": 0 }
  ]
}`}</pre></details>
      {status && <p role="status" className="rounded-lg bg-[#EDF4F0] p-3 text-sm text-[#0F241C]">{status}</p>}
      <button onClick={submit} disabled={busy || !events.length} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1B6A50] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? <Loader2 className="size-4 animate-spin"/> : <FileUp className="size-4"/>}Import test</button>
      {hasTest && <button onClick={remove} className="min-h-10 w-full rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-700">Remove event test</button>}
    </section>
    <aside className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950">The browser requests camera permission and applies copy, paste, context-menu and print deterrents on the test route. These cannot prevent screenshots or photos from another device, and camera presence is not identity verification.</aside>
  </main>;
}
