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
    <section id="about" className="relative bg-[#0F3446] text-[#EDF2EE] overflow-hidden">
      <div className="absolute inset-0 lattice opacity-70 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A2532] to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-page px-4 sm:px-6 pt-10 pb-20 lg:pt-14 lg:pb-28">
        <p className="font-arabic text-center text-2xl sm:text-3xl text-[#E6D3A3]" dir="rtl" lang="ar">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>

        <div className="mt-10 lg:mt-14 grid lg:grid-cols-[1.1fr_.9fr] gap-14 lg:gap-10 items-center">
          {/* text */}
          <div className="order-2 lg:order-1">
            <p className="text-[#E6D3A3]/80 text-sm">Islamic scholar, educator and Sharia consultant</p>
            <h1 className="mt-3 font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.4rem]">
              Sheikh Muhammed<br />Ferej Megeno
            </h1>
            <p className="mt-6 max-w-[34rem] text-[#EDF2EE]/80 text-[17px] leading-relaxed">
              A prominent Ethiopian scholar who has spent more than thirty-five years teaching in traditional circles of knowledge, designing curricula and educating the public across Ethiopia and the Horn of Africa. He serves as President of the Al-Fajr Islamic Foundation.
            </p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3 max-w-[34rem] text-[15px]">
              <li className="flex gap-3"><span className="star-sep mt-1.5 shrink-0" />AAOIFI certified Sharia auditor</li>
              <li className="flex gap-3"><span className="star-sep mt-1.5 shrink-0" />Sharia consultant, Wegagen Bank (Amanah)</li>
              <li className="flex gap-3"><span className="star-sep mt-1.5 shrink-0" />Member, African Scholars Union</li>
              <li className="flex gap-3"><span className="star-sep mt-1.5 shrink-0" />President, Al-Fajr Islamic Foundation</li>
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/media"
                className="inline-flex items-center gap-2 bg-[#BF9A45] text-[#0A2532] font-semibold rounded-full px-6 py-3 hover:bg-[#E6D3A3] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch the lectures
              </Link>
              <Link
                href="/ask"
                className="inline-flex items-center rounded-full px-6 py-3 border border-[#EDF2EE]/30 hover:border-[#E6D3A3] hover:text-[#E6D3A3] transition-colors"
              >
                Ask the Sheikh
              </Link>
            </div>
          </div>

          {/* mihrab */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-[280px] sm:w-[340px] lg:w-[380px] aspect-[3/4]">
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
                  <radialGradient id="glow" cx="50%" cy="38%" r="60%">
                    <stop offset="0" stopColor="#1D6A5A" stopOpacity=".9" />
                    <stop offset="1" stopColor="#0A2532" stopOpacity="1" />
                  </radialGradient>
                </defs>
                <g className="mihrab-fill" clipPath="url(#archClip)">
                  <rect width="360" height="480" fill="url(#glow)" />
                  <rect width="360" height="480" fill="url(#starTile)" />
                </g>
                <path
                  className="mihrab-line"
                  d="M6 480V206C6 96 100 26 180 0C260 26 354 96 354 206V480"
                  fill="none"
                  stroke="#BF9A45"
                  strokeWidth="2"
                />
                <path
                  className="mihrab-inner"
                  d="M24 480V210C24 110 110 46 180 18C250 46 336 110 336 210V480"
                  fill="none"
                  stroke="#E6D3A3"
                  strokeOpacity=".6"
                  strokeWidth="1"
                />
              </svg>

              <div className="mihrab-name absolute inset-x-0 top-[34%] px-8 text-center pointer-events-none">
                <p className="font-arabic text-[2.6rem] sm:text-5xl leading-[1.35] text-[#EDF2EE]" dir="rtl" lang="ar">
                  الشيخ محمد<br />فرج مجنو
                </p>
                <p className="font-arabic mt-2 text-xl text-[#E6D3A3]" dir="rtl" lang="ar">
                  حفظه الله تعالى
                </p>
                <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden="true">
                  <span className="h-px w-10 bg-[#BF9A45]/60" />
                  <span className="star-sep" />
                  <span className="h-px w-10 bg-[#BF9A45]/60" />
                </div>
                <p className="mt-5 font-ethiopic text-[#EDF2EE]/80" lang="am">
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