"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderKanban,
  Play,
  Pause,
  Download,
  Search,
  Clock,
  Music,
  ExternalLink,
  ChevronLeft,
  Volume2,
} from "lucide-react";
import type { PublicSeries, PublicLecture } from "@/lib/api/types";
import { formatDuration } from "@/lib/utils";

interface PlaylistDetailViewProps {
  playlist: PublicSeries;
  locale: string;
}

export function PlaylistDetailView({ playlist, locale }: PlaylistDetailViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const lectures = playlist.lectures || [];

  // Sort lectures strictly by series position
  const sortedLectures = useMemo(() => {
    return [...lectures].sort((a, b) => (a.series?.position || 0) - (b.series?.position || 0));
  }, [lectures]);

  // Filtered by user search
  const filteredLectures = useMemo(() => {
    if (!searchQuery.trim()) return sortedLectures;
    const q = searchQuery.toLowerCase();
    return sortedLectures.filter(
      (l, idx) =>
        l.title.toLowerCase().includes(q) ||
        (l.series?.position && l.series.position.toString().includes(q)) ||
        (idx + 1).toString() === q ||
        (l.summary && l.summary.toLowerCase().includes(q))
    );
  }, [sortedLectures, searchQuery]);

  // Current playing lecture
  const currentTrack = useMemo(() => {
    if (!currentTrackId) return null;
    return sortedLectures.find((l) => l.id === currentTrackId) || null;
  }, [sortedLectures, currentTrackId]);

  const handlePlayTrack = (lecture: PublicLecture) => {
    if (!lecture.media?.audio) return;
    if (currentTrackId === lecture.id) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } else {
      setCurrentTrackId(lecture.id);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = lecture.media.audio;
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          // Auto advance to next ders in sequence
          if (!currentTrackId) return;
          const idx = sortedLectures.findIndex((l) => l.id === currentTrackId);
          if (idx >= 0 && idx < sortedLectures.length - 1) {
            handlePlayTrack(sortedLectures[idx + 1]);
          } else {
            setIsPlaying(false);
          }
        }}
      />

      {/* Floating Sticky Audio Player when a track is active */}
      {currentTrack && currentTrack.media?.audio && (
        <div className="sticky top-4 z-40 bg-[#0D3E2F] text-[#EDF4F0] rounded-2xl p-4 sm:p-5 shadow-xl border border-[#BF9A45]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => handlePlayTrack(currentTrack)}
              className="w-11 h-11 rounded-full bg-[#BF9A45] hover:bg-[#d4ac53] text-[#072118] flex items-center justify-center shrink-0 shadow-md transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E6D3A3]">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>Now Playing • Ders {currentTrack.series?.position?.toString().padStart(2, "0")}</span>
              </div>
              <p className="font-display font-semibold text-sm sm:text-base text-[#EDF4F0] truncate">
                {currentTrack.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <a
              href={currentTrack.media.audio}
              download={`${currentTrack.slug}.mp3`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#EDF4F0] text-xs font-semibold transition-colors border border-white/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{locale === "am" ? "ድምፁን ያውርዱ" : locale === "ar" ? "تحميل الصوت" : "Download Audio"}</span>
            </a>
            <Link
              href={`/${locale}/lectures/${currentTrack.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#BF9A45]/20 hover:bg-[#BF9A45]/30 text-[#E6D3A3] text-xs font-semibold transition-colors border border-[#BF9A45]/40"
            >
              <span>{locale === "am" ? "ዝርዝር" : locale === "ar" ? "تفاصيل" : "Details"}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Search Filter Strip */}
      <div className="bg-white border border-[#0F241C]/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0F241C]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === "am"
                ? "ደርስ በርዕስ ወይም በቁጥር ፈልግ (ለምሳሌ፡ ደርስ 05)..."
                : locale === "ar"
                ? "ابحث عن درس بالرقم أو العنوان (مثلاً: درس 05)..."
                : "Search ders by title or track number (e.g. 05)..."
            }
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-[#0F241C]/15 rounded-xl bg-[#FAF8F5]/50 focus:outline-none focus:border-[#1B6A50] focus:bg-white"
          />
        </div>
        <div className="text-xs font-semibold text-[#0F241C]/70 shrink-0">
          {filteredLectures.length} {locale === "am" ? "ደርሶች ተገኝተዋል" : locale === "ar" ? "دروس متوفرة" : "lessons found"}
        </div>
      </div>

      {/* Sequential Lessons List */}
      <div className="space-y-3">
        {filteredLectures.map((lec, index) => {
          const trackNum = lec.series?.position || index + 1;
          const formattedNum = trackNum.toString().padStart(2, "0");
          const hasAudio = Boolean(lec.media?.audio);
          const isThisPlaying = isPlaying && currentTrackId === lec.id;

          return (
            <div
              key={lec.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                currentTrackId === lec.id
                  ? "bg-[#FAF8F5] border-[#1B6A50] shadow-sm ring-1 ring-[#1B6A50]/20"
                  : "bg-white border-[#0F241C]/10 hover:border-[#1B6A50]/40 shadow-xs"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                {/* Track Number Badge */}
                <div
                  className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center shrink-0 font-mono ${
                    currentTrackId === lec.id
                      ? "bg-[#1B6A50] text-white border-[#1B6A50]"
                      : "bg-[#EDF4F0] text-[#0D3E2F] border-[#0F241C]/10"
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
                    {locale === "am" ? "ደርስ" : locale === "ar" ? "درس" : "Ders"}
                  </span>
                  <span className="text-base font-bold leading-none mt-0.5">{formattedNum}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-semibold text-base sm:text-lg text-[#0F241C] leading-snug break-words">
                    {lec.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#0F241C]/60 mt-1">
                    {lec.duration_seconds ? (
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#BF9A45]" />
                        {formatDuration(lec.duration_seconds)}
                      </span>
                    ) : null}
                    {hasAudio && (
                      <span className="flex items-center gap-1 text-[#1B6A50] font-medium">
                        <Music className="w-3.5 h-3.5" /> High-Quality Audio
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end border-[#0F241C]/5">
                {hasAudio && (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePlayTrack(lec)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        isThisPlaying
                          ? "bg-[#1B6A50] text-white shadow-xs"
                          : "bg-[#EDF4F0] text-[#0D3E2F] hover:bg-[#1B6A50] hover:text-white"
                      }`}
                    >
                      {isThisPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>{locale === "am" ? "አቁም" : locale === "ar" ? "إيقاف" : "Pause"}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          <span>{locale === "am" ? "አዳምጥ" : locale === "ar" ? "استماع" : "Play"}</span>
                        </>
                      )}
                    </button>

                    <a
                      href={lec.media?.audio || "#"}
                      download={`${lec.slug}.mp3`}
                      title={locale === "am" ? "ድምፁን በቀጥታ አውርድ" : locale === "ar" ? "تحميل الملف الصوتي" : "Download Audio"}
                      className="p-2 rounded-xl border border-[#0F241C]/15 text-[#0F241C]/80 hover:text-[#1B6A50] hover:border-[#1B6A50] hover:bg-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </>
                )}

                <Link
                  href={`/${locale}/lectures/${lec.slug}`}
                  title={locale === "am" ? "የደርሱ የተሟላ ገጽ" : "View Lecture Page"}
                  className="p-2 rounded-xl border border-[#0F241C]/15 text-[#0F241C]/80 hover:text-[#1B6A50] hover:border-[#1B6A50] hover:bg-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}

        {filteredLectures.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#0F241C]/10 rounded-2xl p-8">
            <FolderKanban className="w-12 h-12 text-[#0F241C]/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#0F241C]">
              {locale === "am" ? "ምንም ደርሶች አልተገኙም" : "No lessons found in this folder."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
