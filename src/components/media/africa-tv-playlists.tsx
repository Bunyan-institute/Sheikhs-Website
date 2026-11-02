"use client";

import { useState } from "react";
import { Tv, Radio, CheckCircle2, ExternalLink } from "lucide-react";

export interface PlaylistInfo {
  id: string;
  title: string;
  amharicTitle: string;
  channel: string;
  episodeCount: string;
  playlistId: string;
  url: string;
  cover: string;
  description: string;
}

const PLAYLISTS: PlaylistInfo[] = [
  {
    id: "pl_africatv_riyad",
    title: "Africa TV — Riyad us-Saliheen Series (ሪያዱ ሷሊሂን)",
    amharicTitle: "ሪያዱ ሷሊሂን በአፍሪካ ቲቪ — በሸይኽ ሙሐመድ ፈረጅ",
    channel: "AfricaTV1 (አፍሪካ ቲቪ)",
    episodeCount: "Complete Series",
    playlistId: "PL36bhVTcrBX77hDrFAe0OVn0N1QIkY-3u",
    url: "https://www.youtube.com/watch?v=9UjdvmkJaJI&list=PL36bhVTcrBX77hDrFAe0OVn0N1QIkY-3u",
    cover: "/images/photo_12_2026-09-30_23-42-17.jpg",
    description: "The celebrated Africa TV television exegesis of Imam an-Nawawi's Riyad us-Saliheen, expounded by Sheikh Muhammed Ferej across multiple broadcast seasons.",
  },
  {
    id: "pl_yt_main",
    title: "Sheikh Muhammed Ferej — 350+ Hours Darasa Archive",
    amharicTitle: "የሸይኽ ሙሐመድ ፈረጅ የተሟላ የደርስና ዳዕዋ ማህደር (350+ ሰዓታት)",
    channel: "Official Audio Archive",
    episodeCount: "350+ Hours",
    playlistId: "PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
    url: "https://www.youtube.com/playlist?list=PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
    cover: "/images/photo_11_2026-09-30_23-42-17.jpg",
    description: "The primary verified YouTube archive of three decades of halaqaat, Friday Khutbahs, and Tafsir delivered by Sheikh Muhammed Ferej Megeno.",
  },
  {
    id: "pl_africatv_hajj",
    title: "Africa TV — Negere Hajj & Umrah Jurisprudence (ነገረ ሐጅ)",
    amharicTitle: "የሐጅና ዑምራ ስነስርዓት በአፍሪካ ቲቪ — በሸይኽ ሙሐመድ ፈረጅ",
    channel: "AfricaTV1 (አፍሪካ ቲቪ)",
    episodeCount: "Seasonal Exegesis",
    playlistId: "PL36bhVTcrBX77hDrFAe0OVn0N1QIkY-3u",
    url: "https://www.youtube.com/watch?v=-bvmxTp0vFs",
    cover: "/images/photo_18_2026-09-30_23-42-17.jpg",
    description: "Systematic step-by-step guidance on the rites of Hajj, Umrah, and sacred sanctuary visits produced and broadcast by Africa TV.",
  },
  {
    id: "pl_africatv_seerah",
    title: "Africa TV — Nebyu Beleloch Andebet (ነቢዩ በሌሎች አንደበት)",
    amharicTitle: "ነቢዩ (ሰ.ዐ.ወ) በሌሎች አንደበት — በአፍሪካ ቲቪ የተላለፈ",
    channel: "AfricaTV1 (አፍሪካ ቲቪ)",
    episodeCount: "Prophetic Seerah",
    playlistId: "PLzRqlK40SdT6R8jYsWIxMf44Hdl8q3pt3",
    url: "https://www.youtube.com/watch?v=5hlykYaVcn4",
    cover: "/images/photo_1_2026-09-30_23-42-17.jpg",
    description: "Scholarly series examining global historical testimonies and international recognitions of the Prophet Muhammad (ﷺ).",
  },
];

export function AfricaTvPlaylists() {
  const [activePlaylist, setActivePlaylist] = useState<PlaylistInfo>(PLAYLISTS[0]);

  return (
    <div className="space-y-6">
      {/* Playlist Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {PLAYLISTS.map((pl) => {
          const isActive = activePlaylist.id === pl.id;
          return (
            <button
              key={pl.id}
              onClick={() => setActivePlaylist(pl)}
              className={`text-start p-4 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? "bg-white border-[#1B6A50] ring-1 ring-[#1B6A50] shadow-sm"
                  : "bg-white/70 border-[#0F241C]/10 hover:border-[#1B6A50]/50 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className={`font-semibold flex items-center gap-1.5 ${isActive ? "text-[#1B6A50]" : "text-[#BF9A45]"}`}>
                  <Tv className="w-3.5 h-3.5" />
                  <span>{pl.channel}</span>
                </span>
                <span className="text-[10px] bg-[#EDF4F0] text-[#0F241C] px-2 py-0.5 rounded-full font-semibold border border-[#0F241C]/10">
                  {pl.episodeCount}
                </span>
              </div>
              <h4 className="font-display text-sm font-semibold text-[#0F241C] line-clamp-1 mb-1">
                {pl.amharicTitle}
              </h4>
              <p className="text-xs text-[#0F241C]/70 line-clamp-2 leading-relaxed font-sans">
                {pl.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Playlist View */}
      <div className="border border-[#0F241C]/10 rounded-2xl bg-white overflow-hidden shadow-xs flex flex-col lg:flex-row">
        {/* Responsive 16:9 YouTube Playlist Embed */}
        <div className="lg:w-7/12 aspect-video bg-[#072118] relative">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/videoseries?list=${activePlaylist.playlistId}`}
            title={activePlaylist.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Playlist Metadata & Details */}
        <div className="p-5 sm:p-8 flex flex-col justify-between lg:w-5/12 space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#1B6A50] text-[#EDF4F0] text-[11px] font-semibold uppercase tracking-wider">
                {activePlaylist.channel}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-[#EDF4F0] text-[#BF9A45] border border-[#BF9A45]/30 text-[11px] font-semibold">
                {activePlaylist.episodeCount}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-[#EDF4F0] text-[#0F241C]/70 text-[11px] font-medium border border-[#0F241C]/10">
                Official YouTube Playlist
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0F241C] leading-snug">
              {activePlaylist.amharicTitle}
            </h3>

            <p className="font-arabic text-sm text-[#1B6A50] font-medium" dir="rtl">
              سلسلة الدروس المنهجية والمحاضرات لفضيلة الشيخ محمد فرج مجنو حفظه الله
            </p>

            <p className="text-[#0F241C]/75 text-xs sm:text-sm leading-relaxed font-sans">
              {activePlaylist.description}
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#0F241C]">
              <div className="flex items-center gap-2 text-[#1B6A50]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#BF9A45] shrink-0" />
                <span>ቀጥታ የተሟላውን የአፍሪካ ቲቪ የትምህርት ዝርዝር በቅደም ተከተል ይከታተሉ</span>
              </div>
              <div className="flex items-center gap-2 text-[#1B6A50]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#BF9A45] shrink-0" />
                <span>ያለማስታወቂያ በይፋዊው የሞባይል መተግበሪያ ላይም ይገኛል</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#0F241C]/10 flex flex-wrap items-center gap-3">
            <a
              href={activePlaylist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D3E2F] text-[#EDF4F0] font-semibold text-xs hover:bg-[#1B6A50] transition-colors shadow-xs min-h-[40px]"
            >
              <span>Open on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EDF4F0] border border-[#BF9A45]/40 text-[#0F241C] font-semibold text-xs hover:bg-white transition-colors min-h-[40px]"
            >
              <Radio className="w-3.5 h-3.5 text-[#BF9A45]" />
              <span>Listen in App (Offline)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AfricaTvPlaylists;
