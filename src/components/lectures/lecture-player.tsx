"use client";

import { useTranslations } from "next-intl";
import { AlertCircle, AudioLines, Music } from "lucide-react";
import Image from "next/image";

interface LecturePlayerProps {
  media: {
    audio: string | null;
    video: string | null;
    transcript: string | null;
  };
  title: string;
  coverUrl?: string | null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1` : null;
}

export function LecturePlayer({ media, title, coverUrl }: LecturePlayerProps) {
  const t = useTranslations("lectureDetail");
  const tCommon = useTranslations("common");

  if (media.video) {
    const ytEmbed = getYouTubeEmbedUrl(media.video);

    if (ytEmbed) {
      return (
        <div className="w-full overflow-hidden rounded-md bg-[#2D3436] aspect-video shadow-md">
          <iframe
            src={ytEmbed}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      );
    }

    return (
      <div className="w-full overflow-hidden rounded-md bg-[#2D3436] aspect-video flex items-center justify-center">
        <video
          controls
          poster={coverUrl || undefined}
          className="w-full h-full object-contain"
        >
          <source src={media.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (media.audio) {
    return (
      <div className="flex flex-col sm:flex-row items-center w-full rounded-md bg-[#FAF8F5] border border-[#E0D8CE] p-4 sm:p-6 gap-4 sm:gap-6">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-[#E0D8CE] rounded-md overflow-hidden flex items-center justify-center">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <Music className="w-10 h-10 sm:w-12 sm:h-12 text-[#636E72]" />
          )}
        </div>
        <div className="flex-1 w-full min-w-0 space-y-3 sm:space-y-4">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-semibold text-[#2D3436] break-words">{title}</h3>
            <p className="text-xs sm:text-sm text-[#636E72] flex items-center gap-2 mt-1">
              <AudioLines className="w-4 h-4 text-[#1B5E20] shrink-0" /> {t("listenAudio")}
            </p>
          </div>
          <audio controls className="w-full">
            <source src={media.audio} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full rounded-md bg-[#FAF8F5] border border-[#E0D8CE] p-6 sm:p-12 text-center space-y-3">
      <AlertCircle className="w-10 h-10 text-[#B8860B]" />
      <h3 className="font-heading text-lg font-semibold text-[#2D3436]">{tCommon("unavailable")}</h3>
      <p className="text-sm text-[#636E72] max-w-md">
        {tCommon("noContent")}
      </p>
    </div>
  );
}
