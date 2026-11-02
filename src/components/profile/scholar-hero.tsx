"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export interface ScholarHeroProps {
  name?: string;
  headline?: string | null;
  biography?: string | null;
  photoUrl?: string | null;
  locale?: string;
}

export function ScholarHero({
  name = "Sheikh Muhammed Ferej Megeno",
  headline,
  biography,
  photoUrl,
  locale = "en",
}: ScholarHeroProps) {
  let t = (key: string) => key;
  try {
    t = useTranslations("home");
  } catch {
    // fallback
  }

  const badgeText = t("heroBadge") !== "heroBadge" ? t("heroBadge") : (headline || "Islamic scholar, educator and Sharia consultant");
  const scholarName = t("heroName") !== "heroName" ? t("heroName") : name;
  const bioText = t("heroBio") !== "heroBio" ? t("heroBio") : (biography || "A prominent Ethiopian scholar who has spent more than thirty-five years teaching in traditional circles of knowledge, designing curricula and educating the public across Ethiopia and the Horn of Africa. He serves as President of the Al-Fajr Islamic Foundation.");
  
  const cred1 = t("heroCred1") !== "heroCred1" ? t("heroCred1") : "AAOIFI certified Sharia auditor";
  const cred2 = t("heroCred2") !== "heroCred2" ? t("heroCred2") : "Sharia consultant, Wegagen Bank (Amanah)";
  const cred3 = t("heroCred3") !== "heroCred3" ? t("heroCred3") : "Member, African Scholars Union";
  const cred4 = t("heroCred4") !== "heroCred4" ? t("heroCred4") : "President, Al-Fajr Islamic Foundation";
  
  const watchCta = t("heroWatchCta") !== "heroWatchCta" ? t("heroWatchCta") : "Watch the lectures";
  const askCta = t("heroAskCta") !== "heroAskCta" ? t("heroAskCta") : "Ask the Sheikh";

  return (
    <section id="about" className="relative bg-[#0D3E2F] text-[#EDF4F0] overflow-hidden">
      {/* Islamic background pattern and subtle vignette */}
      <div className="absolute inset-0 lattice opacity-60 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#072118] to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute -top-32 -end-32 w-96 h-96 rounded-full bg-[#1B6A50]/20 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-page px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-28">
        <p className="font-arabic text-center text-xl sm:text-2xl lg:text-3xl text-[#E6D3A3] tracking-wide" dir="rtl" lang="ar">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>

        <div className="mt-8 sm:mt-12 lg:mt-14 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center sm:text-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#072118]/70 border border-[#BF9A45]/40 text-[#E6D3A3] text-xs font-semibold mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#BF9A45] animate-pulse" />
              <span>{badgeText}</span>
            </div>
            <h1 className="mt-1 font-display text-3xl sm:text-5xl lg:text-[4rem] leading-[1.1] text-[#EDF4F0] tracking-tight">
              {scholarName}
            </h1>
            <p className="mt-4 sm:mt-6 max-w-[34rem] text-[#EDF4F0]/85 text-base sm:text-[17px] leading-relaxed mx-auto sm:mx-0">
              {bioText}
            </p>

            <ul className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 max-w-[34rem] text-sm sm:text-[15px] text-start">
              <li className="flex items-start gap-3">
                <span className="star-sep mt-1.5 shrink-0 text-[#BF9A45]" />
                <span className="font-medium text-[#EDF4F0]/90">{cred1}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="star-sep mt-1.5 shrink-0 text-[#BF9A45]" />
                <span className="font-medium text-[#EDF4F0]/90">{cred2}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="star-sep mt-1.5 shrink-0 text-[#BF9A45]" />
                <span className="font-medium text-[#EDF4F0]/90">{cred3}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="star-sep mt-1.5 shrink-0 text-[#BF9A45]" />
                <span className="font-medium text-[#EDF4F0]/90">{cred4}</span>
              </li>
            </ul>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-3.5">
              <Link
                href="/media"
                className="inline-flex items-center justify-center gap-2.5 bg-[#BF9A45] text-[#072118] font-bold rounded-full px-7 py-3.5 text-sm sm:text-base hover:bg-[#E6D3A3] transition-all shadow-lg shadow-[#072118]/40 min-h-[46px] cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>{watchCta}</span>
              </Link>
              <Link
                href="/ask"
                className="inline-flex items-center justify-center rounded-full px-7 py-3.5 border border-[#EDF4F0]/40 text-[#EDF4F0] hover:border-[#E6D3A3] hover:text-[#E6D3A3] text-sm sm:text-base font-semibold transition-all min-h-[46px] cursor-pointer"
              >
                {askCta}
              </Link>
            </div>
          </div>

          {/* Mihrab with Authentic Photo of Sheikh Muhammed Ferej */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-[260px] xs:w-[290px] sm:w-[340px] lg:w-[380px] aspect-[3/4] drop-shadow-2xl">
              <svg viewBox="0 0 360 480" className="absolute inset-0 w-full h-full" aria-hidden="true">
                <defs>
                  <clipPath id="archClip">
                    <path d="M24 480V210C24 110 110 46 180 18C250 46 336 110 336 210V480Z" />
                  </clipPath>
                  <pattern id="starTile" width="48" height="48" patternUnits="userSpaceOnUse">
                    <g fill="none" stroke="#BF9A45" strokeOpacity=".35" strokeWidth=".9">
                      <rect x="14" y="14" width="20" height="20" />
                      <rect x="14" y="14" width="20" height="20" transform="rotate(45 24 24)" />
                      <path d="M0 0l10 10M48 0L38 10M0 48l10-10M48 48L38 38" />
                    </g>
                  </pattern>
                  <linearGradient id="photoFade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#072118" stopOpacity="0.1" />
                    <stop offset="38%" stopColor="#072118" stopOpacity="0.25" />
                    <stop offset="68%" stopColor="#072118" stopOpacity="0.82" />
                    <stop offset="100%" stopColor="#072118" stopOpacity="0.98" />
                  </linearGradient>
                </defs>

                {/* Arched Background Wall inside clip */}
                <g clipPath="url(#archClip)">
                  <rect x="0" y="0" width="360" height="480" fill="#072118" />
                  <rect x="0" y="0" width="360" height="480" fill="url(#starTile)" opacity="0.45" />

                  {/* Authentic Portrait Image of Sheikh Muhammed Ferej */}
                  <image
                    href="/images/sheikh-portrait-tall.jpg"
                    x="20"
                    y="10"
                    width="320"
                    height="470"
                    preserveAspectRatio="xMidYMid slice"
                  />

                  {/* Gradient Overlay for Text Readability & Reverence */}
                  <rect x="0" y="0" width="360" height="480" fill="url(#photoFade)" />
                </g>

                {/* Animated Golden Hairline Arch Outlines */}
                <path
                  d="M24 480V210C24 110 110 46 180 18C250 46 336 110 336 210V480"
                  fill="none"
                  stroke="#BF9A45"
                  strokeWidth="2.5"
                  className="mihrab-line"
                />
                <path
                  d="M32 480V214C32 118 114 56 180 30C246 56 328 118 328 214V480"
                  fill="none"
                  stroke="#E6D3A3"
                  strokeWidth="1"
                  strokeOpacity="0.8"
                  className="mihrab-inner"
                />
              </svg>

              {/* Calligraphy Plaque at bottom of Mihrab */}
              <div className="absolute inset-x-4 bottom-6 text-center mihrab-name pointer-events-none z-10">
                <span className="font-arabic text-lg sm:text-xl text-[#E6D3A3] drop-shadow-md block" dir="rtl" lang="ar">
                  الشيخ محمد فرج مجنو حفظه الله تعالى
                </span>
                <span className="font-display text-[11px] sm:text-xs text-[#BF9A45] tracking-[0.2em] uppercase mt-1 block font-semibold drop-shadow-xs">
                  Official Scholar Archive
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScholarHero;
