"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Download, Share2 } from "lucide-react";
import { shareImagePath, sharePagesPath } from "@/lib/share";

export function ContentShare({ title, url, kind, slug, locale }: { title: string; url: string; kind: "articles" | "fatwas"; slug: string; locale: string }) {
  const t = useTranslations("sharing");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const imageUrl = shareImagePath(kind, slug, locale);
  const pagesUrl = sharePagesPath(kind, slug, locale);
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); setMessage(t("copied")); }
    catch { setMessage(t("copyError")); }
  };
  const shareLink = async () => {
    if (!navigator.share) { await copyLink(); return; }
    try { await navigator.share({ title, url }); }
    catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setMessage(t("shareError")); }
  };
  const shareImage = async () => {
    setBusy(true); setMessage("");
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Image unavailable");
      const blob = await response.blob();
      const file = new File([blob], `${slug}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title, text: url });
      else {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a"); link.href = objectUrl; link.download = `${slug}.png`; link.click();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000); setMessage(t("downloaded"));
      }
    } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setMessage(t("imageError")); }
    finally { setBusy(false); }
  };
  const button = "inline-flex items-center justify-center gap-2 rounded-xl border border-[#1B6A50]/25 bg-white px-4 py-3 text-sm font-semibold text-[#0D3E2F] hover:bg-[#EDF4F0] disabled:opacity-50";
  return (
    <section aria-label={t("title")} className="my-6 rounded-2xl border border-[#1B6A50]/20 bg-[#EDF4F0]/60 p-4 sm:p-5">
      <h2 className="mb-3 text-base font-semibold text-[#0D3E2F]">{t("title")}</h2>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={button} onClick={shareLink}><Share2 className="size-4" />{t("shareLink")}</button>
        <button type="button" className={button} onClick={copyLink}><Copy className="size-4" />{t("copyLink")}</button>
        <a className={button} href={`${imageUrl}&download=1`} download={`${slug}.png`}><Download className="size-4" />{t("downloadImage")}</a>
        <button type="button" className={button} disabled={busy} onClick={shareImage}><Share2 className="size-4" />{busy ? t("preparing") : t("shareImage")}</button>
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#BF9A45]/35 bg-[#F8F6EF] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#0D3E2F]">{t("pagesTitle")}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#0F241C]/70">{t("pagesDescription")}</p>
        </div>
        <a className={`${button} shrink-0`} href={pagesUrl} download={`${slug}-pages.zip`}>
          <Download className="size-4" />{t("downloadPages")}
        </a>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#1B6A50]">
        <a href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">Telegram</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
      </div>
      <p role="status" className="mt-3 text-sm text-[#0D3E2F]">{message}</p>
    </section>
  );
}
