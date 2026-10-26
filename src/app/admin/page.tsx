import Link from "next/link";
import {
  getSystemMetrics,
  getAllInquiries,
  getAllLectures,
  getAllArticles,
} from "@/lib/db/repository";
import {
  Video,
  FileText,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Database,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";

export default function AdminDashboardPage() {
  const metrics = getSystemMetrics();
  const inquiries = getAllInquiries().slice(0, 5);
  const recentLectures = getAllLectures().slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1B5E20] via-[#236b28] to-[#154a19] rounded-xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs font-arabic" dir="rtl">
            <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span>۞</span>
            <span>لوحة التحكم الرئيسية</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
            Sheikh Muhammed Ferej Megeno
          </h1>
          <p className="text-emerald-100/90 text-sm max-w-xl">
            Live Scholarly Knowledge Management. All additions and edits are dynamically synchronized with the public multilingual portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/lectures"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-white text-[#1B5E20] font-bold text-xs hover:bg-emerald-50 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lecture</span>
          </Link>
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-white/15 text-white font-bold text-xs hover:bg-white/25 transition-colors border border-white/20"
          >
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
          </Link>
          <Link
            href="/admin/backup"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded bg-black/20 text-emerald-100 font-medium text-xs hover:bg-black/30 transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Backup</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link
          href="/admin/lectures"
          className="bg-white border border-[#E0D8CE] p-5 rounded-lg hover:border-[#1B5E20] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold text-[#636E72] tracking-wider">
              Lectures & Audio
            </span>
            <div className="w-8 h-8 rounded-full bg-[#1B5E20]/10 text-[#1B5E20] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-3xl font-bold text-[#2D3436]">
            {metrics.lecturesCount}
          </div>
          <div className="mt-2 text-xs text-[#636E72] flex items-center justify-between">
            <span>{metrics.videoLectures} HD Videos</span>
            <span>&bull;</span>
            <span>{metrics.audioLessons} Audio Lessons</span>
          </div>
        </Link>

        <Link
          href="/admin/articles"
          className="bg-white border border-[#E0D8CE] p-5 rounded-lg hover:border-[#1B5E20] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold text-[#636E72] tracking-wider">
              Hadith Articles
            </span>
            <div className="w-8 h-8 rounded-full bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-3xl font-bold text-[#2D3436]">
            {metrics.articlesCount}
          </div>
          <div className="mt-2 text-xs text-[#636E72]">
            Tafsir, Hadith Exegesis & Spiritual Studies
          </div>
        </Link>

        <Link
          href="/admin/fatwas"
          className="bg-white border border-[#E0D8CE] p-5 rounded-lg hover:border-[#1B5E20] hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold text-[#636E72] tracking-wider">
              Fatwas & Rulings
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-3xl font-bold text-[#2D3436]">
            {metrics.fatwasCount}
          </div>
          <div className="mt-2 text-xs text-[#636E72]">
            Fiqh Rulings & Banking Standards
          </div>
        </Link>

        <Link
          href="/admin/inquiries"
          className={`border p-5 rounded-lg hover:shadow-xs transition-all group ${
            metrics.pendingInquiries > 0
              ? "bg-[#FFF8E1] border-[#B8860B]"
              : "bg-white border-[#E0D8CE] hover:border-[#1B5E20]"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-bold text-[#636E72] tracking-wider">
              Public Inquiries
            </span>
            <div className="w-8 h-8 rounded-full bg-[#B8860B]/20 text-[#B8860B] flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-3xl font-bold text-[#2D3436] flex items-center gap-2">
            <span>{metrics.inquiriesTotal}</span>
            {metrics.pendingInquiries > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#B8860B] text-white">
                {metrics.pendingInquiries} New
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-[#636E72]">
            Submitted questions from /ask
          </div>
        </Link>
      </div>

      {/* Main Content Split: Recent Inquiries + Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inquiries Inbox */}
        <div className="lg:col-span-7 bg-white border border-[#E0D8CE] rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E0D8CE] pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#2D3436]">
                Latest Community Inquiries
              </h2>
              <p className="text-xs text-[#636E72]">
                Questions submitted by visitors requiring scholarly guidance
              </p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-[#1B5E20] hover:underline flex items-center gap-1"
            >
              <span>View All ({metrics.inquiriesTotal})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-10 text-sm text-[#636E72]">
              No questions submitted yet.
            </div>
          ) : (
            <div className="divide-y divide-[#FAF8F5] space-y-2">
              {inquiries.map((inq) => (
                <div key={inq.id} className="pt-3 pb-2 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#2D3436]">
                      {inq.name || "Anonymous Inquirer"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inq.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#636E72] line-clamp-2 leading-relaxed">
                    {inq.question}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#636E72]/80 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(inq.created_at).toLocaleDateString()}
                    </span>
                    <Link
                      href="/admin/inquiries"
                      className="font-bold text-[#1B5E20] hover:underline"
                    >
                      Answer / Convert &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Status & Recent Content */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white border border-[#E0D8CE] rounded-lg p-5 shadow-2xs space-y-3">
            <h3 className="font-heading text-sm font-bold text-[#2D3436] uppercase tracking-wider border-b border-[#E0D8CE] pb-2">
              Quick Management Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <Link
                href="/admin/lectures"
                className="p-3 rounded-md bg-[#FAF8F5] border border-[#E0D8CE] hover:border-[#1B5E20] hover:bg-white transition-all font-semibold text-[#2D3436] flex items-center gap-2"
              >
                <Video className="w-4 h-4 text-[#1B5E20]" />
                <span>New Lecture</span>
              </Link>
              <Link
                href="/admin/series"
                className="p-3 rounded-md bg-[#FAF8F5] border border-[#E0D8CE] hover:border-[#1B5E20] hover:bg-white transition-all font-semibold text-[#2D3436] flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-[#B8860B]" />
                <span>Manage Series</span>
              </Link>
              <Link
                href="/admin/fatwas"
                className="p-3 rounded-md bg-[#FAF8F5] border border-[#E0D8CE] hover:border-[#1B5E20] hover:bg-white transition-all font-semibold text-[#2D3436] flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Publish Fatwa</span>
              </Link>
              <Link
                href="/admin/library"
                className="p-3 rounded-md bg-[#FAF8F5] border border-[#E0D8CE] hover:border-[#1B5E20] hover:bg-white transition-all font-semibold text-[#2D3436] flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#1B5E20]" />
                <span>Upload Kitab</span>
              </Link>
              <Link
                href="/admin/events"
                className="p-3 rounded-md bg-[#FAF8F5] border border-[#E0D8CE] hover:border-[#1B5E20] hover:bg-white transition-all font-semibold text-[#2D3436] flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Add Event</span>
              </Link>
              <Link
                href="/admin/profile"
                className="p-3 rounded-md bg-[#FAF8F5] border border-[#E0D8CE] hover:border-[#1B5E20] hover:bg-white transition-all font-semibold text-[#2D3436] flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                <span>Scholar Bio</span>
              </Link>
            </div>
          </div>

          {/* System Engine Health Card */}
          <div className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-lg p-5 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2D3436] uppercase tracking-wider text-[11px]">
                Engine Status
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B5E20] bg-emerald-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Persistent & Active
              </span>
            </div>
            <div className="space-y-1.5 text-[#636E72]">
              <div className="flex justify-between py-1 border-b border-[#E0D8CE]/50">
                <span>Storage Provider:</span>
                <strong className="text-[#2D3436]">Unified JSON Repository</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E0D8CE]/50">
                <span>Cache Invalidation:</span>
                <strong className="text-[#1B5E20]">Automatic on Save</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Last Updated:</span>
                <span className="text-[#2D3436]">{new Date(metrics.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
