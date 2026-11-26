"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, CircleAlert, Loader2, ShieldCheck } from "lucide-react";

type Question = { id: string; question: string; options: string[] };
type TestPayload = { event: { title: string }; passing_percentage: number; questions: Question[] };

export function EventTestClient({ slug, title }: { slug: string; title: string }) {
  const [test, setTest] = useState<TestPayload | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ score: number; passed: boolean; correct_count: number; total_questions: number; passing_percentage: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stopCamera = useCallback(() => { setStream((current) => { current?.getTracks().forEach((track) => track.stop()); return null; }); }, []);

  useEffect(() => { fetch(`/api/events/test?slug=${encodeURIComponent(slug)}`, { cache: "no-store" }).then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error); setTest(d); }).catch((e) => setError(e.message)); }, [slug]);
  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
    return () => { stream?.getTracks().forEach((track) => track.stop()); };
  }, [stream]);
  useEffect(() => {
    if (!stream) return;
    const onEnded = () => { setError("Camera access ended. Allow camera access again to continue."); stopCamera(); };
    stream.getVideoTracks().forEach((track) => track.addEventListener("ended", onEnded));
    return () => stream.getVideoTracks().forEach((track) => track.removeEventListener("ended", onEnded));
  }, [stream, stopCamera]);
  useEffect(() => {
    if (!stream) return;
    const prevent = (e: Event) => e.preventDefault();
    const keys = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && ["c", "p", "s", "u"].includes(e.key.toLowerCase())) e.preventDefault(); };
    const print = () => { document.body.classList.add("test-print-block"); };
    document.addEventListener("contextmenu", prevent); document.addEventListener("copy", prevent); document.addEventListener("cut", prevent); document.addEventListener("paste", prevent); document.addEventListener("selectstart", prevent); window.addEventListener("keydown", keys); window.addEventListener("beforeprint", print);
    return () => { document.removeEventListener("contextmenu", prevent); document.removeEventListener("copy", prevent); document.removeEventListener("cut", prevent); document.removeEventListener("paste", prevent); document.removeEventListener("selectstart", prevent); window.removeEventListener("keydown", keys); window.removeEventListener("beforeprint", print); document.body.classList.remove("test-print-block"); };
  }, [stream]);

  const start = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) { setError("This browser cannot access a camera. Open this test in a current browser over HTTPS."); return; }
    try {
      const camera = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      setStream(camera);
      try { await document.documentElement.requestFullscreen?.(); } catch { /* fullscreen can be declined by the browser */ }
    } catch { setError("Camera permission is required to begin. Allow camera access in your browser settings, then try again."); }
  };

  const submit = async () => {
    if (!stream?.getVideoTracks().some((track) => track.readyState === "live")) { setError("Camera access is required while taking this test."); stopCamera(); return; }
    if (!test || answers && Object.keys(answers).length !== test.questions.length) { setError("Please answer every question first."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/events/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, answers }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not submit test.");
      setResult(data); stopCamera(); if (document.fullscreenElement) await document.exitFullscreen().catch(() => undefined);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not submit test."); }
    finally { setBusy(false); }
  };

  if (error && !test) return <div className="min-h-[70vh] grid place-items-center p-6"><p role="alert" className="text-red-700">{error}</p></div>;
  if (!test) return <div className="min-h-[70vh] grid place-items-center"><Loader2 className="animate-spin" aria-label="Loading test" /></div>;

  return <main className={`min-h-screen bg-[#EDF4F0] px-4 py-8 sm:py-12 ${stream ? "select-none" : ""}`}>
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="rounded-2xl bg-[#072118] p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#E6D3A3]">Assessment</p><h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-3 text-sm text-white/80">{test.questions.length} questions · pass mark {test.passing_percentage}%</p>
      </header>
      {!stream && !result && <section className="rounded-2xl border border-[#BF9A45]/40 bg-white p-6 shadow-sm">
        <ShieldCheck className="mb-3 size-7 text-[#1B6A50]"/><h2 className="text-lg font-bold text-[#0F241C]">Before you begin</h2>
        <p className="mt-2 text-sm leading-6 text-[#43534B]">This test asks for camera access and attempts to block copying, pasting, context menus, and printing while it is open. The camera preview stays on this device and is not recorded or uploaded. Fullscreen will be requested when supported.</p>
        <p className="mt-2 text-xs leading-5 text-[#795D18]">These browser controls are deterrents only. A website cannot reliably prevent screenshots, browser extensions, or photos taken with another device.</p>
        <button onClick={start} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1B6A50] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0D3E2F]"><Camera className="size-4"/>Allow camera and begin</button>
      </section>}
      {stream && !result && <section className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"><Camera className="size-5"/><span>Camera is on for this test. Video remains on your device.</span><video ref={videoRef} autoPlay muted playsInline className="ms-auto h-12 w-16 rounded object-cover"/></section>}
      {stream && !result && <div className="space-y-4">{test.questions.map((q, i) => <fieldset key={q.id} className="rounded-xl border border-[#0F241C]/10 bg-white p-5 shadow-sm"><legend className="font-bold text-[#0F241C]">{i + 1}. {q.question}</legend><div className="mt-3 space-y-2">{q.options.map((option, oi) => <label key={oi} className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#E0D8CE] p-3 text-sm hover:bg-[#F5F8F5]"><input type="radio" name={q.id} checked={answers[q.id] === oi} onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))} className="mt-0.5 accent-[#1B6A50]"/><span>{option}</span></label>)}</div></fieldset>)}
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} onClick={submit} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1B6A50] px-5 py-3 font-bold text-white disabled:opacity-60">{busy && <Loader2 className="size-4 animate-spin"/>}Submit answers</button></div>}
      {result && <section className="rounded-2xl bg-white p-8 text-center shadow"><div className={`mx-auto grid size-14 place-items-center rounded-full ${result.passed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{result.passed ? <CheckCircle2/> : <CircleAlert/>}</div><h2 className="mt-4 text-2xl font-bold text-[#0F241C]">{result.passed ? "Test passed" : "Test complete"}</h2><p className="mt-2 text-[#43534B]">{result.score}% ({result.correct_count} of {result.total_questions} correct) · pass mark {result.passing_percentage}%</p><Link href={`/events/${slug}`} className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-[#1B6A50] px-5 font-semibold text-[#1B6A50]">Back to event</Link></section>}
    </div>
  </main>;
}
