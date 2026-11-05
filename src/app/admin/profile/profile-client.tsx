"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UploadField } from "@/components/admin/ui/upload-field";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { useTranslations } from "next-intl";
import {
  User,
  GraduationCap,
  Milestone,
  CheckCircle,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
  Save,
  Globe,
  Share2,
} from "lucide-react";
import {
  updateProfileAction,
  updateJourneyAction,
  updateQualificationsAction,
} from "../actions";
import type { PublicProfile, SectionMap } from "@/lib/api/types";
import type { JourneyMilestone, QualificationRecord } from "@/lib/db/types";

export function ProfileClient({
  initialProfile,
  initialJourney,
  initialQualifications,
}: {
  initialProfile: PublicProfile;
  initialJourney: JourneyMilestone[];
  initialQualifications: QualificationRecord[];
}) {
  const { toast, confirm, prompt } = useAdminFeedback();
  const t = useTranslations("admin.profile");
  const tCommon = useTranslations("admin.common");

  const [activeTab, setActiveTab] = useState<"profile" | "qualifications" | "journey">("profile");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const [name, setName] = useState(initialProfile.name);
  const [headline, setHeadline] = useState(initialProfile.headline || "");
  const [location, setLocation] = useState(initialProfile.location || "");
  const [biography, setBiography] = useState(initialProfile.biography || "");
  const [photoUrl, setPhotoUrl] = useState(initialProfile.photo?.url || "/images/sheikh-portrait.jpg");
  const [tiktok, setTiktok] = useState(initialProfile.socials?.tiktok || "");
  const [youtube, setYoutube] = useState(initialProfile.socials?.youtube || "");
  const [facebook, setFacebook] = useState(initialProfile.socials?.facebook || "");
  const [telegram, setTelegram] = useState(initialProfile.socials?.telegram || "");
  const [playStore, setPlayStore] = useState(initialProfile.socials?.play_store || "");
  const [sections, setSections] = useState<SectionMap>(initialProfile.sections);

  // Qualifications State
  const [qualifications, setQualifications] = useState<QualificationRecord[]>(initialQualifications);

  // Journey Milestones State
  const [journey, setJourney] = useState<JourneyMilestone[]>(initialJourney);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await updateProfileAction({
        name,
        headline,
        location,
        biography,
        photoUrl,
        socials: {
          tiktok,
          youtube,
          facebook,
          telegram,
          play_store: playStore,
        },
        sections,
      });
      setFeedback(t("savedNotice"));
    } catch (err: any) {
      toast.error(tCommon("error") + ": " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveQualifications = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      await updateQualificationsAction(qualifications);
      setFeedback(t("savedNotice"));
    } catch (err: any) {
      toast.error(tCommon("error") + ": " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQualification = () => {
    setQualifications([
      ...qualifications,
      {
        id: `qual_${Date.now()}`,
        title: "New Qualification / Ijazah",
        issuer: "Islamic University / Scholarly Council",
        year: `${new Date().getFullYear()}`,
        type: "academic",
        description: "Scholarly certification and license...",
      },
    ]);
  };

  const handleUpdateQualField = (index: number, field: keyof QualificationRecord, val: string) => {
    const next = [...qualifications];
    next[index] = { ...next[index], [field]: val };
    setQualifications(next);
  };

  const handleRemoveQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const handleSaveJourney = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      await updateJourneyAction(journey);
      setFeedback(t("savedNotice"));
    } catch (err: any) {
      toast.error(tCommon("error") + ": " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMilestone = () => {
    setJourney([
      {
        year: `${new Date().getFullYear()}`,
        title: "New Scholarly Milestone",
        description: "Milestone description and achievements...",
        institution: "Addis Ababa, Ethiopia",
        type: "contribution",
      },
      ...journey,
    ]);
  };

  const handleUpdateMilestone = (index: number, field: keyof JourneyMilestone, val: string) => {
    const next = [...journey];
    next[index] = { ...next[index], [field]: val };
    setJourney(next);
  };

  const handleRemoveMilestone = (index: number) => {
    setJourney(journey.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            {t("heading")}
          </h1>
          <p className="text-xs text-[#636E72] mt-0.5">
            {t("subheading")}
          </p>
        </div>

        <Link
          href="/about"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] border border-[#E0D8CE] bg-white text-[#2D3436] hover:border-[#1B5E20] text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <span>{tCommon("viewLiveSite")} (/about)</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#1B5E20]" />
        </Link>
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

      {/* Tabs */}
      <div className="flex border-b border-[#E0D8CE] gap-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "profile"
              ? "border-[#1B5E20] text-[#1B5E20]"
              : "border-transparent text-[#636E72] hover:text-[#2D3436]"
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t("name")} & {t("socials")}</span>
        </button>

        <button
          onClick={() => setActiveTab("qualifications")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "qualifications"
              ? "border-[#1B5E20] text-[#1B5E20]"
              : "border-transparent text-[#636E72] hover:text-[#2D3436]"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{t("credentials")} ({qualifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("journey")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "journey"
              ? "border-[#1B5E20] text-[#1B5E20]"
              : "border-transparent text-[#636E72] hover:text-[#2D3436]"
          }`}
        >
          <Milestone className="w-4 h-4" />
          <span>{tCommon("series")} ({journey.length})</span>
        </button>
      </div>

      {/* Tab 1: Profile & Socials Form */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Main Info */}
            <div className="lg:col-span-2 space-y-4 bg-white border border-[#E0D8CE] rounded-lg p-5">
              <h2 className="font-heading font-bold text-base text-[#2D3436] border-b border-[#F0EAE1] pb-2">
                {t("heading")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    {t("name")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    {t("headline")}
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Senior Islamic Scholar & Sharia Consultant"
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Addis Ababa, Ethiopia"
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  {t("bio")}
                </label>
                <textarea
                  rows={8}
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  placeholder="Detailed life history, Islamic education, memorization of the Holy Quran, and contributions..."
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20] font-sans leading-relaxed"
                />
              </div>

              {/* Social Channels */}
              <h2 className="font-heading font-bold text-base text-[#2D3436] border-b border-[#F0EAE1] pt-4 pb-2">
                {t("socials")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/@..."
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Telegram Channel URL
                  </label>
                  <input
                    type="url"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="https://t.me/..."
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Google Play app URL
                  </label>
                  <input
                    type="url"
                    value={playStore}
                    onChange={(e) => setPlayStore(e.target.value)}
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>

                <fieldset className="sm:col-span-2 border border-[#E0D8CE] rounded p-3">
                  <legend className="px-1 text-xs font-semibold text-[#2D3436]">Public sections (shown in navigation)</legend>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {(Object.keys(sections) as (keyof SectionMap)[]).map((key) => (
                      <label key={key} className="inline-flex items-center gap-2 text-xs text-[#2D3436] capitalize">
                        <input
                          type="checkbox"
                          checked={sections[key]}
                          onChange={(e) => setSections({ ...sections, [key]: e.target.checked })}
                          className="accent-[#1B5E20]"
                        />
                        {key}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    TikTok Profile URL
                  </label>
                  <input
                    type="url"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="https://tiktok.com/@..."
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>
            </div>

            {/* Right 1 Col: Portrait Preview */}
            <div className="space-y-4 bg-white border border-[#E0D8CE] rounded-lg p-5">
              <h2 className="font-heading font-bold text-base text-[#2D3436] border-b border-[#F0EAE1] pb-2">
                Portrait
              </h2>

              <div className="relative aspect-square w-full rounded-md overflow-hidden bg-[#F5F1EB] border border-[#E0D8CE]">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#636E72]">
                    <User className="w-16 h-16 opacity-30" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Portrait Image URL
                </label>
                <UploadField value={photoUrl} onChange={setPhotoUrl} accept="image/*" placeholder="/images/sheikh-portrait.jpg" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{t("saveProfile")}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Qualifications & Ijazahs */}
      {activeTab === "qualifications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#636E72]">
              {t("credentials")}
            </p>
            <button
              onClick={handleAddQualification}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{tCommon("add")}</span>
            </button>
          </div>

          <div className="space-y-3">
            {qualifications.map((q, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E0D8CE] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 flex-1">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#2D3436] mb-0.5">
                      {tCommon("title")}
                    </label>
                    <input
                      type="text"
                      value={q.title}
                      onChange={(e) => handleUpdateQualField(idx, "title", e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#2D3436] mb-0.5">
                      Institution / Shuyukh
                    </label>
                    <input
                      type="text"
                      value={q.issuer}
                      onChange={(e) => handleUpdateQualField(idx, "issuer", e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#2D3436] mb-0.5">
                      Year / Field
                    </label>
                    <input
                      type="text"
                      value={q.year || ""}
                      placeholder="e.g. 1994 / Usul al-Fiqh"
                      onChange={(e) => handleUpdateQualField(idx, "year", e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveQualification(idx)}
                  className="p-1.5 text-[#636E72] hover:text-red-600 hover:bg-red-50 rounded transition-colors self-end md:self-center"
                  title={tCommon("delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              onClick={handleSaveQualifications}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{tCommon("save")}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Journey Milestones */}
      {activeTab === "journey" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#636E72]">
              {t("subheading")}
            </p>
            <button
              onClick={handleAddMilestone}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{tCommon("add")}</span>
            </button>
          </div>

          <div className="space-y-3">
            {journey.map((m, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E0D8CE] rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-semibold text-[#2D3436] mb-0.5">
                        Year / Period
                      </label>
                      <input
                        type="text"
                        value={m.year}
                        onChange={(e) => handleUpdateMilestone(idx, "year", e.target.value)}
                        placeholder="e.g. 1988 or 1990 - 1995"
                        className="w-full text-xs px-2.5 py-1.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#2D3436] mb-0.5">
                        {tCommon("title")}
                      </label>
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => handleUpdateMilestone(idx, "title", e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveMilestone(idx)}
                    className="p-1.5 text-[#636E72] hover:text-red-600 hover:bg-red-50 rounded transition-colors self-start"
                    title={tCommon("delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#2D3436] mb-0.5">
                    Description & Impact
                  </label>
                  <textarea
                    rows={2}
                    value={m.description}
                    onChange={(e) => handleUpdateMilestone(idx, "description", e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              onClick={handleSaveJourney}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{tCommon("save")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
