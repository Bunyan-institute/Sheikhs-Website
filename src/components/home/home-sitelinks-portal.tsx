import { Link } from "@/i18n/navigation";
import { 
  Scale, 
  BookOpen, 
  Layers, 
  GraduationCap, 
  HelpCircle, 
  ArrowRight 
} from "lucide-react";
import { PRIMARY_SITELINKS } from "@/lib/seo";

const ICONS = [Scale, BookOpen, Layers, GraduationCap, HelpCircle];

export function HomeSitelinksPortal({ locale }: { locale: string }) {
  const isRtl = locale === "ar";

  const badges: Record<string, { en: string; am: string; ar: string; om: string }> = {
    "/fatwas": { en: "VERIFIED RULINGS", am: "የተረጋገጡ ብይኖች", ar: "فتاوى مؤصلة", om: "MURTII SHARI'AA" },
    "/articles": { en: "RESEARCH & ESSAYS", am: "ምርምርና ጽሑፎች", ar: "بحوث ومقالات", om: "QORANNOO" },
    "/series": { en: "AUDIO LESSONS", am: "ተከታታይ ደርሶች", ar: "سلاسل علمية", om: "DARSIIWWAAN" },
    "/courses": { en: "ACADEMY SYLLABI", am: "ሥርዓተ-ትምህርት", ar: "مناهج تأصيلية", om: "LEENJIIWWAN" },
    "/ask": { en: "DIRECT INQUIRIES", am: "ቀጥታ ጥያቄዎች", ar: "استفتاء مباشر", om: "GAAFFII KALLATTII" },
  };

  return (
    <section 
      aria-labelledby="sitelinks-heading"
      className="relative bg-[#072118] text-[#EDF4F0] border-b border-[#BF9A45]/20 py-10 sm:py-14"
    >
      <div className="absolute inset-0 lattice opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-page mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                الأبواب العلمية الرئيسية
              </span>
              <span className="star-sep text-[#BF9A45]" />
              <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/85 font-semibold">
                Official Scholar Sitelinks
              </span>
            </div>
            <h2 id="sitelinks-heading" className="font-display text-2xl sm:text-3xl text-[#EDF4F0] font-bold">
              {locale === "am"
                ? "ዋና ዋና የዕውቀት ማዕከሎች"
                : locale === "ar"
                ? "الأبواب العلمية والخدمات الشرعية"
                : locale === "om"
                ? "Maddeen Barnoota fi Tajaajiloota"
                : "Primary Scholar Portals & Services"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#EDF4F0]/70 max-w-md font-sans leading-relaxed">
            {locale === "am"
              ? "የሸይኽ ሙሐመድ ፈረጅ መገኖን ይፋዊ ፈትዋዎች፣ ጥናታዊ ጽሑፎች፣ የደርስ ስብስቦች፣ ኮርሶች እና የጥያቄ መቀበያ በቀጥታ ያግኙ።"
              : locale === "ar"
              ? "الوصول المباشر إلى الأقسام الأكثر زيارة: الفتاوى المعتمدة، المقالات، السلاسل الصوتية، الدورات، واستفتاء الشيخ."
              : locale === "om"
              ? "Kallattiin fatwaawwan, barreeffamoota, darsiiwwan fi koorsoota Sheekh Muhammad Faraj argadhaa."
              : "Direct access to authenticated fatwas, scholarly treatises, audio lecture series, academy courses, and inquiry desks."}
          </p>
        </div>

        <nav aria-label="Official Scholar Sitelinks" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PRIMARY_SITELINKS.map((item, idx) => {
            const Icon = ICONS[idx] || BookOpen;
            const title = item.name[locale] || item.name.en;
            const description = item.description[locale] || item.description.en;
            const badge = badges[item.subpath]?.[locale as keyof typeof badges["/fatwas"]] || "FEATURED";

            return (
              <Link
                key={item.subpath}
                href={item.subpath}
                title={title}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#0D3E2F]/60 border border-[#BF9A45]/25 hover:border-[#BF9A45] hover:bg-[#0D3E2F] transition-all duration-200 hover:-translate-y-1 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#BF9A45]/15 border border-[#BF9A45]/30 flex items-center justify-center text-[#E6D3A3] group-hover:bg-[#BF9A45] group-hover:text-[#072118] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6D3A3]/80 px-2 py-0.5 rounded-full bg-[#072118]/60 border border-[#BF9A45]/20">
                      {badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-[#EDF4F0] group-hover:text-[#E6D3A3] transition-colors mb-2 leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs text-[#EDF4F0]/70 leading-relaxed font-sans line-clamp-3">
                    {description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDF4F0]/10 flex items-center justify-between text-xs font-semibold text-[#BF9A45] group-hover:text-[#E6D3A3]">
                  <span>
                    {locale === "am"
                      ? "ክፈት"
                      : locale === "ar"
                      ? "تصفح القسم"
                      : locale === "om"
                      ? "Bani"
                      : "Explore"}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${isRtl ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
