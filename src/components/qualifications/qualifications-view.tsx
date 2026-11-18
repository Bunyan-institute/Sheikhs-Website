"use client";

import { useState, useMemo } from "react";
import { Award, GraduationCap, BookOpen, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { QualificationRecord } from "@/lib/db/types";

interface QualificationsViewProps {
  qualifications: QualificationRecord[];
  translations: {
    all: string;
    academic: string;
    ijazah: string;
    certificate: string;
    verifiedBadge: string;
    verifiedSub: string;
    noItems: string;
  };
}

const TYPE_CONFIG: Record<
  string,
  { label: string; badgeClass: string; icon: any }
> = {
  academic: {
    label: "University Degree",
    badgeClass: "bg-[#BF9A45]/15 text-[#072118] border-[#BF9A45]/40",
    icon: GraduationCap,
  },
  ijazah: {
    label: "Traditional Ijazah & Sanad",
    badgeClass: "bg-[#1B6A50]/15 text-[#1B6A50] border-[#1B6A50]/30",
    icon: BookOpen,
  },
  traditional: {
    label: "Traditional Ijazah & Sanad",
    badgeClass: "bg-[#1B6A50]/15 text-[#1B6A50] border-[#1B6A50]/30",
    icon: BookOpen,
  },
  certificate: {
    label: "Certified Qualification",
    badgeClass: "bg-[#0D3E2F]/15 text-[#0D3E2F] border-[#0D3E2F]/30",
    icon: Award,
  },
  certification: {
    label: "Certified Qualification",
    badgeClass: "bg-[#0D3E2F]/15 text-[#0D3E2F] border-[#0D3E2F]/30",
    icon: Award,
  },
  other: {
    label: "Accreditation",
    badgeClass: "bg-[#0F241C]/10 text-[#0F241C]/80 border-[#0F241C]/20",
    icon: ShieldCheck,
  },
};

export function QualificationsView({ qualifications, translations }: QualificationsViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: translations.all, count: qualifications.length },
    {
      id: "academic",
      label: translations.academic,
      count: qualifications.filter((q) => q.type === "academic").length,
    },
    {
      id: "ijazah",
      label: translations.ijazah,
      count: qualifications.filter((q) => q.type === "ijazah" || q.type === "traditional").length,
    },
    {
      id: "certificate",
      label: translations.certificate,
      count: qualifications.filter(
        (q) => q.type === "certificate" || q.type === "certification" || q.type === "other"
      ).length,
    },
  ];

  const filtered = useMemo(() => {
    if (selectedFilter === "all") return qualifications;
    if (selectedFilter === "academic") return qualifications.filter((q) => q.type === "academic");
    if (selectedFilter === "ijazah") {
      return qualifications.filter((q) => q.type === "ijazah" || q.type === "traditional");
    }
    if (selectedFilter === "certificate") {
      return qualifications.filter(
        (q) => q.type === "certificate" || q.type === "certification" || q.type === "other"
      );
    }
    return qualifications;
  }, [qualifications, selectedFilter]);

  return (
    <div className="space-y-10">
      {/* Verified Scholar Trust Seal Banner */}
      <div className="bg-[#FAF8F5] border border-[#BF9A45]/30 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0D3E2F] text-[#E6D3A3] flex items-center justify-center shrink-0 shadow-sm border border-[#BF9A45]/40">
            <ShieldCheck className="w-6 h-6 text-[#BF9A45]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1B6A50] uppercase tracking-wider">
                {translations.verifiedBadge}
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#1B6A50]" />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F241C] mt-0.5">
              Verified Scholarly Transmission &amp; Academic Credentials
            </h2>
            <p className="text-xs sm:text-sm text-[#0F241C]/70 mt-1 max-w-2xl leading-relaxed">
              {translations.verifiedSub}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <span className="px-3 py-1.5 rounded-full bg-[#1B6A50]/10 text-[#1B6A50] font-semibold text-xs border border-[#1B6A50]/20">
            {qualifications.length} Authenticated Records
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-[#0F241C]/10">
        {categories.map((cat) => {
          const isActive = selectedFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-4 py-2 rounded-full font-medium text-xs transition-all flex items-center gap-2 min-h-[36px] cursor-pointer ${
                isActive
                  ? "bg-[#0D3E2F] text-[#EDF4F0] shadow-xs font-semibold"
                  : "text-[#0F241C]/75 hover:text-[#0F241C] hover:bg-white border border-[#0F241C]/15"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-[#EDF4F0]" : "bg-[#0F241C]/5 text-[#0F241C]/60"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Qualifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filtered.map((qual, idx) => {
          const config = TYPE_CONFIG[qual.type] || TYPE_CONFIG.other;
          const Icon = config.icon;

          return (
            <div
              key={qual.id}
              className="bg-white border border-[#0F241C]/10 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#1B6A50] transition-all flex flex-col justify-between group hover:shadow-md"
            >
              <div>
                <div className="flex justify-between items-start gap-3 mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full border ${config.badgeClass}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{config.label}</span>
                  </span>
                  <span className="text-[#0F241C]/70 text-xs font-semibold bg-[#EDF4F0] px-2.5 py-1 rounded-full border border-[#0F241C]/10">
                    {qual.year}
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold text-[#0F241C] mb-2 break-words group-hover:text-[#1B6A50] transition-colors">
                  {qual.title}
                </h3>

                <p className="text-[#BF9A45] font-semibold text-xs mb-4 pb-3 border-b border-[#0F241C]/10 break-words">
                  {qual.issuer}
                </p>

                <p className="text-[#0F241C]/75 leading-relaxed text-xs sm:text-sm break-words">
                  {qual.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#0F241C]/5 flex items-center justify-between text-[11px] text-[#0F241C]/50">
                <span>Record #{idx + 1}</span>
                <span className="font-medium text-[#1B6A50] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Documented
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white border border-[#0F241C]/10 rounded-2xl p-8">
            <Award className="w-12 h-12 text-[#0F241C]/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#0F241C]">{translations.noItems}</p>
          </div>
        )}
      </div>
    </div>
  );
}
