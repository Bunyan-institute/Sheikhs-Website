"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ClipboardPaste, Link2, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { MediaEmbed } from "@/components/media/media-embed";
import { parseMediaUrl, isPlayable, type ParsedMedia } from "@/lib/media-source";
import { fetchMediaMetadata } from "@/app/admin/actions";
import { UploadField } from "./upload-field";
import { buttonSecondary } from "./form-field";

interface SourceFieldProps {
  value: string;
  onChange: (url: string) => void;
  /** Offer the title found for a pasted link. */
  onTitle?: (title: string) => void;
  /** Offer the picture found for a pasted link as a cover. */
  onThumbnail?: (url: string) => void;
  /** Called with the length in seconds when it can be read from a direct audio/video file. */
  onDuration?: (seconds: number) => void;
  accept?: string;
  /** Hide the live preview (useful in tight layouts). */
  hidePreview?: boolean;
  id?: string;
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

/** Turns "38:12", "1:02:03" or a plain number of minutes into seconds. Returns null when empty or invalid. */
export function parseDuration(text: string): number | null {
  const t = text.trim();
  if (!t) return null;
  if (/^\d+$/.test(t)) return Number(t) * 60;
  const parts = t.split(":").map((p) => (/^\d+$/.test(p) ? Number(p) : NaN));
  if (parts.some(Number.isNaN) || parts.length > 3) return null;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

/** Human label for what a link is (used by the chip here and by lists). */
export function useProviderLabel() {
  const t = useTranslations("admin.source");
  return (p: ParsedMedia): string => {
    if (!p.valid) return "";
    switch (p.provider) {
      case "youtube": return "YouTube";
      case "facebook": return "Facebook";
      case "tiktok": return "TikTok";
      case "telegram": return "Telegram";
      default:
        return p.kind === "video" ? t("videoFile") : p.kind === "audio" ? t("audioFile") : p.kind === "image" ? t("imageFile") : p.kind === "document" ? t("documentFile") : "";
    }
  };
}

/**
 * One field for "a link or a file": paste or upload, it recognises the source, shows a live preview and offers
 * the title, cover picture and length it can find, without ever overwriting what the user typed.
 */
export function SourceField({ value, onChange, onTitle, onThumbnail, onDuration, accept = "audio/*,video/mp4,video/webm", hidePreview, id }: SourceFieldProps) {
  const t = useTranslations("admin.source");
  const tCommon = useTranslations("admin.common");
  const label = useProviderLabel();
  const parsed = useMemo(() => parseMediaUrl(value), [value]);
  const [suggestion, setSuggestion] = useState<{ title?: string; thumbnailUrl?: string }>({});
  const [detectedSeconds, setDetectedSeconds] = useState<number | null>(null);
  const [canPaste, setCanPaste] = useState(false);
  const onDurationRef = useRef(onDuration);
  onDurationRef.current = onDuration;

  useEffect(() => {
    setCanPaste(typeof navigator !== "undefined" && Boolean(navigator.clipboard?.readText));
  }, []);

  // Title / picture for YouTube and TikTok links (server-side oEmbed; silently empty when unavailable).
  useEffect(() => {
    setSuggestion({});
    if (!parsed.valid || !(onTitle || onThumbnail)) return;
    if (parsed.thumbnailUrl) setSuggestion({ thumbnailUrl: parsed.thumbnailUrl });
    if (parsed.provider !== "youtube" && parsed.provider !== "tiktok") return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const meta = await fetchMediaMetadata(parsed.url);
        if (!cancelled) setSuggestion({ title: meta.title, thumbnailUrl: meta.thumbnailUrl ?? parsed.thumbnailUrl });
      } catch {
        // metadata is a convenience only
      }
    }, 700);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed.url]);

  // Length of direct audio/video files, read from the file's own metadata in the browser.
  useEffect(() => {
    setDetectedSeconds(null);
    if (!parsed.valid || !(parsed.provider === "direct" || parsed.provider === "upload") || !(parsed.kind === "audio" || parsed.kind === "video")) return;
    const el = document.createElement(parsed.kind === "audio" ? "audio" : "video");
    el.preload = "metadata";
    const done = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        const seconds = Math.round(el.duration);
        setDetectedSeconds(seconds);
        onDurationRef.current?.(seconds);
      }
    };
    el.addEventListener("loadedmetadata", done);
    el.src = parsed.url;
    return () => {
      el.removeEventListener("loadedmetadata", done);
      el.removeAttribute("src");
      el.load();
    };
  }, [parsed.url, parsed.valid, parsed.provider, parsed.kind]);

  const pasteButton = canPaste ? (
    <button
      type="button"
      className={`${buttonSecondary} shrink-0 !px-3`}
      aria-label={tCommon("paste")}
      title={tCommon("paste")}
      onClick={async () => {
        try {
          const text = (await navigator.clipboard.readText()).trim();
          if (text) onChange(text);
        } catch {
          // clipboard permission denied: the user can still paste by hand
        }
      }}
    >
      <ClipboardPaste className="size-4" />
      <span className="hidden sm:inline">{tCommon("paste")}</span>
    </button>
  ) : undefined;

  const chip = value.trim() && parsed.valid ? label(parsed) || t("plainLink") : "";

  return (
    <div className="space-y-2.5" data-source-field>
      <UploadField
        value={value}
        onChange={onChange}
        accept={accept}
        placeholder={t("placeholder")}
        extraButton={pasteButton}
        id={id}
      />

      {value.trim() && !parsed.valid && (
        <p role="alert" className="flex items-center gap-2 text-sm font-medium text-adm-danger">
          <AlertCircle className="size-4 shrink-0" />
          {t("invalid")}
        </p>
      )}

      {value.trim() && parsed.valid && (
        <div className="space-y-2.5">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-adm-muted">
            <span className="inline-flex items-center gap-1.5 font-semibold text-adm-primary" data-source-chip>
              <CheckCircle2 className="size-4" />
              {t("detected", { name: chip })}
            </span>
            {detectedSeconds !== null && <span>{t("lengthDetected", { time: formatDuration(detectedSeconds) })}</span>}
          </p>

          {parsed.provider === "unknown" && (
            <p className="flex items-center gap-2 text-sm text-adm-muted">
              <Link2 className="size-4 shrink-0" />
              {t("plainLink")}
            </p>
          )}

          {(suggestion.title || suggestion.thumbnailUrl) && (onTitle || onThumbnail) && (
            <div className="flex flex-wrap gap-2">
              {onTitle && suggestion.title && (
                <button type="button" className={`${buttonSecondary} !min-h-10 max-w-full !px-3 text-start`} onClick={() => { onTitle(suggestion.title!); setSuggestion((s) => ({ ...s, title: undefined })); }}>
                  <span className="truncate">{t("useTitle", { title: suggestion.title })}</span>
                </button>
              )}
              {onThumbnail && suggestion.thumbnailUrl && (
                <button type="button" className={`${buttonSecondary} !min-h-10 !px-3`} onClick={() => { onThumbnail(suggestion.thumbnailUrl!); setSuggestion((s) => ({ ...s, thumbnailUrl: undefined })); }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={suggestion.thumbnailUrl} alt="" className="size-6 rounded object-cover" />
                  {t("useCover")}
                </button>
              )}
            </div>
          )}

          {!hidePreview && isPlayable(parsed) && (
            <div className="max-w-md">
              <MediaEmbed url={parsed.url} title="" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
