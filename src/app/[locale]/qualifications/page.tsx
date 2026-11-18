import { getTranslations, setRequestLocale } from "next-intl/server";
import { getQualifications } from "@/lib/db/repository";
import { getSiteUrl, getScholarEntity, buildHreflangAlternates } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { QualificationsView } from "@/components/qualifications/qualifications-view";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "qualifications" });
  const siteUrl = getSiteUrl();
  const title = t("title");
  const fullTitle = `${t("title")} | Sheikh Muhammed Ferej Megeno`;
  const description = `${t("verifiedCertifications")} — Academic degrees, AAOIFI Sharia standards certifications, and traditional sanad of Sheikh Muhammed Ferej Megeno.`;

  return {
    title,
    description,
    keywords: [
      "Islamic Qualifications",
      "Sanad",
      "Ijazah",
      "AAOIFI Sharia Advisor",
      "Islamic University of Minnesota",
      "Sheikh Muhammed Ferej",
      "ማስረጃዎች",
      "إجازات شرعية",
    ],
    alternates: buildHreflangAlternates("/qualifications", locale),
    openGraph: {
      type: "profile",
      title: fullTitle,
      description,
      url: `${siteUrl}/${locale}/qualifications`,
      images: [{ url: `${siteUrl}/images/sheikh-portrait.jpg`, width: 1200, height: 1200, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${siteUrl}/images/sheikh-portrait.jpg`],
    },
  };
}

export default async function QualificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "qualifications" });
  const qualifications = await getQualifications();
  const siteUrl = getSiteUrl();

  const qualificationsSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${t("title")} | Sheikh Muhammed Ferej Megeno`,
    url: `${siteUrl}/${locale}/qualifications`,
    mainEntity: getScholarEntity(),
  };

  const translations = {
    all: locale === "am" ? "ሁሉም ማስረጃዎች" : locale === "ar" ? "كافة المؤهلات" : locale === "om" ? "Hunda" : "All Credentials",
    academic: locale === "am" ? "የዩኒቨርሲቲ ዲግሪዎች" : locale === "ar" ? "الشهادات الجامعية" : locale === "om" ? "Digirii Yuunivarsitii" : "University Degrees",
    ijazah: locale === "am" ? "ባህላዊ ኢጃዛና ሰነድ" : locale === "ar" ? "الإجازات والأسانيد" : locale === "om" ? "Ijaazaa fi Sanada" : "Traditional Sanad & Ijazah",
    certificate: locale === "am" ? "የሙያና የሸሪዓ ማረጋገጫዎች" : locale === "ar" ? "الشهادات المهنية والمعيارية" : locale === "om" ? "Sartafikeetota" : "Professional Certifications",
    verifiedBadge: locale === "am" ? "የተረጋገጡ የትምህርት ማስረጃዎች" : locale === "ar" ? "مؤهلات وأسانيد معتمدة" : locale === "om" ? "Ragaalee Mirkanaa'an" : "Verified Scholarly Credentials",
    verifiedSub: locale === "am"
      ? "በሸሪዓና በህግ፣ በኢስላማዊ ጥናትና በባህላዊ የዕውቀት ሰንሰለት (ሰነድ) የተገኙ ይፋዊ የትምህርት ማስረጃዎች።"
      : locale === "ar"
      ? "توثيق شامل للدرجات العلمية في الشريعة والقانون، والأسانيد المتصلة، والمعايير الشرعية المعتمدة."
      : locale === "om"
      ? "Ragaalee barnootaa fi ijaazaawwan seera shari'aa fi barnoota Islaamaa irratti argaman."
      : "Formal academic degrees in Sharia and Law, postgraduate honors, AAOIFI audit certifications, and unbroken transmission sanads.",
    noItems: locale === "am" ? "በዚህ ምድብ ምንም ማስረጃ አልተገኘም።" : locale === "ar" ? "لا توجد مؤهلات في هذا القسم." : locale === "om" ? "Ragaan hin jiru." : "No credentials found in this category.",
  };

  return (
    <div className="w-full">
      <JsonLd data={qualificationsSchema} />
      {/* Page Hero Header */}
      <section className="relative bg-[#0D3E2F] text-[#EDF4F0] py-14 sm:py-16 overflow-hidden border-b border-[#BF9A45]/20">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-arabic text-sm text-[#E6D3A3] font-bold" dir="rtl">
                  {t("arabicBadge")}
                </span>
                <span className="star-sep text-[#BF9A45]" />
                <span className="text-xs uppercase tracking-widest text-[#E6D3A3]/85 font-semibold">
                  {t("subtitle")}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#EDF4F0]">
                {t("title")}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#EDF4F0]/80 max-w-xl font-sans leading-relaxed">
              {t("verifiedCertifications")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <QualificationsView
          qualifications={qualifications}
          translations={translations}
        />
      </div>
    </div>
  );
}
