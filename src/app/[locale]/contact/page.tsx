import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getProfile } from '@/lib/api/profile';
import { Link } from '@/i18n/navigation';
import { MapPin, MessageSquare, ArrowRight, Building } from 'lucide-react';

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "contact" });
  const profile = await getProfile(params.locale).catch(() => null);
  const socialsList = profile?.socials 
    ? Object.entries(profile.socials).map(([platform, url]) => ({ platform, url }))
    : [];

  return (
    <div className="w-full">
      {/* Page Hero Header */}
      <section className="relative bg-[#0D3E2F] text-[#EDF4F0] py-14 sm:py-16 overflow-hidden border-b border-[#BF9A45]/20">
        <div className="absolute inset-0 lattice opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-page mx-auto px-4 sm:px-6">
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
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Office Channels Card */}
          <div className="bg-white border border-[#0F241C]/10 p-5 sm:p-8 rounded-2xl space-y-6 shadow-xs">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0F241C] pb-3 border-b border-[#0F241C]/10">
              Scholarly Office Channels
            </h2>
            
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                 <div className="w-11 h-11 rounded-xl bg-[#EDF4F0] border border-[#BF9A45]/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#BF9A45]" />
                 </div>
                 <div>
                    <h3 className="font-display font-bold text-base text-[#0F241C] mb-1">Office Location</h3>
                    <p className="text-xs text-[#0F241C]/80 font-semibold">{profile?.location || "Addis Ababa, Ethiopia"}</p>
                    <p className="text-xs text-[#0F241C]/60 mt-1 leading-relaxed">Al-Fajr Islamic Foundation headquarters &amp; traditional teaching circle.</p>
                 </div>
               </div>
               
               <div className="flex items-start gap-4">
                 <div className="w-11 h-11 rounded-xl bg-[#EDF4F0] border border-[#BF9A45]/30 flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5 text-[#1B6A50]" />
                 </div>
                 <div>
                    <h3 className="font-display font-bold text-base text-[#0F241C] mb-1">Sharia Advisory Desk</h3>
                    <p className="text-xs text-[#0F241C]/80 font-semibold">Wegagen Bank — Amanah Window Sharia Board</p>
                    <p className="text-xs text-[#0F241C]/60 mt-1 leading-relaxed">AAOIFI standards governance and ethical banking audit inquiries.</p>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="w-11 h-11 rounded-xl bg-[#EDF4F0] border border-[#BF9A45]/30 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-[#BF9A45]" />
                 </div>
                 <div>
                    <h3 className="font-display font-bold text-base text-[#0F241C] mb-1">Ask the Sheikh</h3>
                    <p className="text-xs text-[#0F241C]/70 mb-3 leading-relaxed">For personal religious inquiries, fatwa questions, and spiritual advice.</p>
                    <Link href="/ask" className="inline-flex items-center gap-2 text-xs font-bold bg-[#BF9A45] text-[#072118] px-5 py-2.5 rounded-full hover:bg-[#E6D3A3] transition-colors shadow-sm min-h-[40px]">
                      <span>Submit Inquiry</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#072118]" />
                    </Link>
                 </div>
               </div>
            </div>
          </div>

          {/* Social Channels Card */}
          <div className="bg-white border border-[#0F241C]/10 p-5 sm:p-8 rounded-2xl space-y-6 shadow-xs">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0F241C] pb-3 border-b border-[#0F241C]/10">
              Official Broadcast &amp; Social Archives
            </h2>
            <p className="text-xs text-[#0F241C]/70 leading-relaxed font-sans">
              Direct access to official channels broadcasting the Sheikh&apos;s lectures, short reminders, and weekly halaqat.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
               {socialsList.map((social, idx: number) => (
                  <a 
                    key={idx} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border border-[#0F241C]/10 rounded-xl hover:border-[#1B6A50] bg-[#EDF4F0]/50 transition-colors group"
                  >
                     <div className="min-w-0">
                        <span className="font-display font-semibold text-sm capitalize text-[#0F241C] group-hover:text-[#1B6A50] block truncate">
                          {social.platform}
                        </span>
                        <span className="text-[11px] text-[#BF9A45] font-medium block truncate">
                          Verified Scholar Channel
                        </span>
                     </div>
                  </a>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
