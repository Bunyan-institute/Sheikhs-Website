import { Link } from "@/i18n/navigation";

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
  return (
    <section id="about" className="relative bg-[#0D3E2F] text-[#EDF4F0] overflow-hidden">
      {/* Islamic background pattern and subtle vignette */}
      <div className="absolute inset-0 lattice opacity-60 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#072118] to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute -top-32 -end-32 w-96 h-96 rounded-full bg-[#1B6A50]/20 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-page px-4 sm:px-6 pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-28">
        <p className="font-arabic text-center text-xl sm:text-2xl lg:text-3xl text-[#E6D3A3] tracking-wide" dir="rtl" lang="ar">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>

        <div className="mt-8 sm:mt-12 lg:mt-14 grid lg:grid-cols-[1.1fr_.9fr] gap-10 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center sm:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#072118]/60 border border-[#BF9A45]/40 text-[#E6D3A3] text-xs font-medium mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BF9A45] animate-pulse" />
              <span>Islamic scholar, educator and Sharia consultant</span>
            </div>
            <h1 className="mt-1 font-display text-3xl sm:text-5xl lg:text-[4.2rem] leading-[1.08] text-[#EDF4F0] tracking-tight">
              Sheikh Muhammed<br className="hidden sm:inline" /> Ferej Megeno
            </h1>
            <p className="mt-4 sm:mt-6 max-w-[34rem] text-[#EDF4F0]/85 text-base sm:text-[17px] leading-relaxed mx-auto sm:mx-0">
              A prominent Ethiopian scholar who has spent more than thirty-five years teaching in traditional circles of knowledge, designing curricula and educating the public across Ethiopia and the Horn of Africa. He serves as President of the Al-Fajr Islamic Foundation.
            </p>

            <ul className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-w-[34rem] text-sm sm:text-[15px] text-start">
              <li className="flex items-start gap-3">
                <span className="star-sep mt-1.5 shrink-0 text-[#BF9A45]" />
                <span>AAOIFI certified Sharia auditor</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="star-sep mt-1.5 shrink-0 text-[#BF9A45]" />
                <span>Sharia consultant, Wegagen Bank (Amanah)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="star-sep mt-1.5 shrink-0 text-[#BF9A45]" />
                <span>Member, African Scholars Union</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="star-sep mt-1.5 shrink-0 text-[#BF9A45]" />
                <span>President, Al-Fajr Islamic Foundation</span>
              </li>
            </ul>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-3.5">
              <Link
                href="/media"
                className="inline-flex items-center justify-center gap-2.5 bg-[#BF9A45] text-[#072118] font-bold rounded-full px-6 py-3.5 text-sm sm:text-base hover:bg-[#E6D3A3] transition-colors shadow-lg shadow-[#072118]/30 min-h-[44px]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Watch the lectures</span>
              </Link>
              <Link
                href="/ask"
                className="inline-flex items-center justify-center rounded-full px-6 py-3.5 border border-[#EDF4F0]/30 text-[#EDF4F0] hover:border-[#E6D3A3] hover:text-[#E6D3A3] text-sm sm:text-base transition-colors min-h-[44px]"
              >
                Ask the Sheikh
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
                <g className="mihrab-fill" clipPath="url(#archClip)">
                  <rect width="360" height="480" fill="#072118" />
                  {/* Authentic portrait of Sheikh Muhammed Ferej */}
                  <image
                    href="/images/sheikh-portrait-tall.jpg"
                    x="0"
                    y="0"
                    width="360"
                    height="480"
                    preserveAspectRatio="xMidYMid slice"
                  />
                  {/* Subtle dark emerald gradient overlay for calligraphy readability */}
                  <rect width="360" height="480" fill="url(#photoFade)" />
                  {/* Star pattern accents over overlay */}
                  <rect width="360" height="480" fill="url(#starTile)" opacity="0.35" />
                </g>
                <path
                  className="mihrab-line"
                  d="M6 480V206C6 96 100 26 180 0C260 26 354 96 354 206V480"
                  fill="none"
                  stroke="#BF9A45"
                  strokeWidth="2.5"
                />
                <path
                  className="mihrab-inner"
                  d="M24 480V210C24 110 110 46 180 18C250 46 336 110 336 210V480"
                  fill="none"
                  stroke="#E6D3A3"
                  strokeOpacity=".75"
                  strokeWidth="1.2"
                />
              </svg>

              {/* Dignified Calligraphy at base of Mihrab */}
              <div className="mihrab-name absolute inset-x-0 bottom-6 sm:bottom-8 px-6 text-center pointer-events-none drop-shadow-md">
                <p className="font-arabic text-2xl sm:text-4xl leading-tight text-[#EDF4F0] font-bold" dir="rtl" lang="ar">
                  الشيخ محمد<br />فرج مجنو
                </p>
                <p className="font-arabic mt-1 text-sm sm:text-base text-[#E6D3A3] font-medium" dir="rtl" lang="ar">
                  حفظه الله تعالى
                </p>
                <div className="mx-auto mt-2.5 sm:mt-3 flex items-center justify-center gap-2.5" aria-hidden="true">
                  <span className="h-px w-8 sm:w-10 bg-[#BF9A45]/70" />
                  <span className="star-sep text-[#BF9A45]" />
                  <span className="h-px w-8 sm:w-10 bg-[#BF9A45]/70" />
                </div>
                <p className="mt-2 font-ethiopic text-xs sm:text-sm text-[#EDF4F0]/90 font-medium" lang="am">
                  ሸይኽ ሙሐመድ ፈረጅ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScholarHero;
