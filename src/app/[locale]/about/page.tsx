import { setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/api/profile";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  let profile;
  try {
    profile = await getProfile(locale);
  } catch {
    profile = null;
  }
  return {
    title: "About",
    description: profile?.biography?.slice(0, 160) ?? `About ${profile?.name || "the Scholar"}`,
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  let profile;
  try {
    profile = await getProfile(locale);
  } catch (error) {
    console.error("Failed to load profile", error);
  }

  if (!profile) return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-20 text-center text-[#636E72]">
      <p>Failed to load profile information.</p>
    </div>
  );

  const photoUrl = profile.photo?.url;

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        <aside className="lg:w-1/3 shrink-0 space-y-6 sm:space-y-8">
          <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none mx-auto lg:mx-0 aspect-square rounded-[4px] overflow-hidden bg-[#FAF8F5] border border-[#E0D8CE] flex items-center justify-center relative shadow-sm">
            {photoUrl ? (
              <Image src={photoUrl} alt={profile.name || "Scholar"} fill className="object-cover" />
            ) : (
              <div className="text-8xl font-heading font-bold text-[#1B5E20]">
                {(profile.name || "S").charAt(0)}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#2D3436] break-words">{profile.name}</h1>
              {profile.headline && (
                <p className="text-base sm:text-lg text-[#1B5E20] font-medium mt-1">{profile.headline}</p>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-[#E0D8CE]">
              {profile.location && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#B8860B] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span className="text-[#2D3436]">{profile.location}</span>
                </div>
              )}
              {profile.languages && profile.languages.length > 0 && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#B8860B] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                  <span className="text-[#2D3436]">{profile.languages.join(", ")}</span>
                </div>
              )}
            </div>

            {profile.socials && Object.keys(profile.socials).length > 0 && (
              <div className="space-y-4 pt-6 border-t border-[#E0D8CE]">
                <h3 className="font-heading font-semibold text-[#2D3436]">Connect</h3>
                <div className="flex flex-col gap-3">
                  {Object.entries(profile.socials).map(([platform, url]) => (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#636E72] hover:text-[#1B5E20] transition-colors">
                      <span className="text-sm font-medium capitalize">{platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="lg:w-2/3 space-y-10">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#2D3436] mb-6 pb-4 border-b border-[#E0D8CE]">Biography</h2>
            <article className="prose prose-slate max-w-none text-[#636E72] font-body prose-headings:font-heading prose-headings:text-[#2D3436] prose-a:text-[#1B5E20] leading-relaxed whitespace-pre-wrap text-base break-words">
              {profile.biography}
            </article>
          </div>

          {/* Institutional Highlights */}
          <div className="pt-6 border-t border-[#E0D8CE]">
            <h3 className="font-heading text-xl font-bold text-[#2D3436] mb-4">Institutional Roles & Community Service</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF8F5] border border-[#E0D8CE] p-4 rounded-md">
                <span className="text-xs uppercase font-bold text-[#1B5E20] tracking-wider block mb-1">Islamic Banking</span>
                <h4 className="font-heading font-bold text-[#2D3436]">Sharia Banking Consultant</h4>
                <p className="text-xs text-[#636E72] mt-1">Wegagen Bank — Islamic Banking Window (AAOIFI Standard Governance)</p>
              </div>
              <div className="bg-[#FAF8F5] border border-[#E0D8CE] p-4 rounded-md">
                <span className="text-xs uppercase font-bold text-[#1B5E20] tracking-wider block mb-1">Pan-African Dawah</span>
                <h4 className="font-heading font-bold text-[#2D3436]">African Scholars Union</h4>
                <p className="text-xs text-[#636E72] mt-1">Active member contributing to continental Sharia deliberations and educational initiatives.</p>
              </div>
              <div className="bg-[#FAF8F5] border border-[#E0D8CE] p-4 rounded-md">
                <span className="text-xs uppercase font-bold text-[#1B5E20] tracking-wider block mb-1">Foundation Leadership</span>
                <h4 className="font-heading font-bold text-[#2D3436]">President, Al-Fajr Islamic Foundation</h4>
                <p className="text-xs text-[#636E72] mt-1">Overseeing Islamic education, community welfare, and educational centers in Addis Ababa.</p>
              </div>
              <div className="bg-[#FAF8F5] border border-[#E0D8CE] p-4 rounded-md">
                <span className="text-xs uppercase font-bold text-[#1B5E20] tracking-wider block mb-1">Quranic Exegesis</span>
                <h4 className="font-heading font-bold text-[#2D3436]">Tafsir Translation Committee</h4>
                <p className="text-xs text-[#636E72] mt-1">Co-translator of the authorized Amharic Mukhtasar Tafsir (Summary Interpretation of the Holy Quran).</p>
              </div>
            </div>
          </div>

          {/* Quick Access to Scholar Modules */}
          <div className="pt-6 border-t border-[#E0D8CE]">
            <h3 className="font-heading text-xl font-bold text-[#2D3436] mb-4">Explore Scholarly Archives</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/journey" className="block p-4 bg-white border border-[#E0D8CE] rounded-md hover:border-[#1B5E20] hover:shadow-xs transition-all group">
                <div className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider mb-1">Timeline</div>
                <div className="font-heading font-bold text-[#2D3436] group-hover:text-[#1B5E20] transition-colors">Educational Journey &rarr;</div>
                <div className="text-xs text-[#636E72] mt-1">From Silti & Jimma Halaqat to postgraduate degrees.</div>
              </Link>
              <Link href="/qualifications" className="block p-4 bg-white border border-[#E0D8CE] rounded-md hover:border-[#1B5E20] hover:shadow-xs transition-all group">
                <div className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider mb-1">Credentials</div>
                <div className="font-heading font-bold text-[#2D3436] group-hover:text-[#1B5E20] transition-colors">Degrees & Ijazat &rarr;</div>
                <div className="text-xs text-[#636E72] mt-1">AAOIFI auditor diploma and traditional chains.</div>
              </Link>
              <Link href="/library" className="block p-4 bg-white border border-[#E0D8CE] rounded-md hover:border-[#1B5E20] hover:shadow-xs transition-all group">
                <div className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider mb-1">Kitabs & Treatises</div>
                <div className="font-heading font-bold text-[#2D3436] group-hover:text-[#1B5E20] transition-colors">Digital Library &rarr;</div>
                <div className="text-xs text-[#636E72] mt-1">Read 132-page Kitab At-Tawheed and verified CV.</div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
