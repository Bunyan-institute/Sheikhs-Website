"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Film,
  Music,
  FileText,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { saveMediaAction, deleteMediaAction } from "../actions";
import type { MediaRef } from "@/lib/api/types";

export function MediaClient({ initialMedia }: { initialMedia: MediaRef[] }) {
  const [mediaList, setMediaList] = useState<MediaRef[]>(initialMedia);
  const [activeFilter, setActiveFilter] = useState<"all" | "image" | "audio" | "video" | "document">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Media Form
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaKind, setMediaKind] = useState<"image" | "audio" | "video" | "document">("image");
  const [mediaId, setMediaId] = useState("");

  const filteredItems = mediaList.filter((m) => {
    if (activeFilter === "all") return true;
    return m.kind === activeFilter;
  });

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openNewModal = () => {
    setMediaUrl("");
    setMediaKind("image");
    setMediaId(`med_${Date.now()}`);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) return;

    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await saveMediaAction({
        id: mediaId.trim() || undefined,
        url: mediaUrl.trim(),
        kind: mediaKind,
      });

      setMediaList((prev) => [res.media, ...prev.filter((m) => m.id !== res.media.id)]);
      setIsModalOpen(false);
      setFeedback("Media asset registered successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this media reference?")) return;
    try {
      await deleteMediaAction(id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      setFeedback("Media item removed.");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            Media Assets & Documents ({mediaList.length})
          </h1>
          <p className="text-xs text-[#636E72] mt-0.5">
            Manage imagery, audio recitations, PDF treatises, and multimedia references across the portal.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Asset</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E0D8CE] pb-3">
        {(
          [
            { id: "all", label: "All Media", count: mediaList.length },
            { id: "image", label: "Images", count: mediaList.filter((m) => m.kind === "image").length },
            { id: "audio", label: "Audio", count: mediaList.filter((m) => m.kind === "audio").length },
            { id: "video", label: "Videos", count: mediaList.filter((m) => m.kind === "video").length },
            { id: "document", label: "Documents", count: mediaList.filter((m) => m.kind === "document").length },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeFilter === tab.id
                ? "bg-[#1B5E20] text-white"
                : "bg-white text-[#636E72] hover:text-[#2D3436] border border-[#E0D8CE]"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-[#E0D8CE] rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#1B5E20] transition-colors shadow-2xs"
          >
            {/* Visual Thumbnail */}
            <div className="relative aspect-video w-full bg-[#F5F1EB] flex items-center justify-center overflow-hidden">
              {item.kind === "image" ? (
                <Image
                  src={item.url}
                  alt={item.id}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : item.kind === "audio" ? (
                <Music className="w-10 h-10 text-[#C5A059]" />
              ) : item.kind === "video" ? (
                <Film className="w-10 h-10 text-sky-600" />
              ) : (
                <FileText className="w-10 h-10 text-amber-600" />
              )}

              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-xs">
                {item.kind}
              </span>
            </div>

            {/* Details */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-mono text-[#2D3436] truncate mb-1" title={item.id}>
                  {item.id}
                </p>
                <p className="text-[10px] text-[#636E72] font-mono truncate" title={item.url}>
                  {item.url}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F0EAE1] mt-3">
                <button
                  onClick={() => handleCopy(item.url, item.id)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#1B5E20] hover:text-[#154a19] font-medium cursor-pointer"
                  title="Copy URL"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-[#636E72] hover:text-[#1B5E20]"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-[#636E72] hover:text-red-600"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-[#636E72] bg-white border border-[#E0D8CE] rounded-lg">
            No media assets found in this filter.
          </div>
        )}
      </div>

      {/* Add Media Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E0D8CE] pb-3">
              <h2 className="font-heading font-bold text-lg text-[#2D3436]">Register Media Asset</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#636E72] hover:text-[#2D3436]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Media Type *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["image", "audio", "video", "document"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setMediaKind(k)}
                      className={`py-2 px-2 rounded text-xs font-medium capitalize border text-center transition-colors ${
                        mediaKind === k
                          ? "bg-[#1B5E20] text-white border-[#1B5E20]"
                          : "bg-white text-[#636E72] border-[#E0D8CE] hover:border-[#1B5E20]"
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  URL / Asset Path *
                </label>
                <input
                  type="text"
                  required
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://... or /images/..."
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Asset Identifier (Optional)
                </label>
                <input
                  type="text"
                  value={mediaId}
                  onChange={(e) => setMediaId(e.target.value)}
                  placeholder="med_example"
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E0D8CE]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#636E72] hover:bg-[#F5F1EB] rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Media</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
