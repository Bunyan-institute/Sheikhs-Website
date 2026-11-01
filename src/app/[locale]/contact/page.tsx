import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getProfile } from '@/lib/api/profile';
import { Link } from '@/i18n/navigation';
import { MapPin, MessageSquare, ArrowRight, Building, Mail } from 'lucide-react';

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "contact" });
  const profile = await getProfile(params.locale).catch(() => null);
  const socialsList = profile?.socials 
    ? Object.entries(profile.socials).map(([platform, url]) => ({ platform, url }))
    : [];

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      {/* Classical Scholarly Header */}
      <header className="mb-10 pb-6 border-b border-[#E6E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-arabic text-sm text-[#1A4D2E] font-bold" dir="rtl">
                {t("arabicBadge")}
              </span>
              <span className="text-[#B8860B]">۞</span>
              <span className="text-xs uppercase tracking-widest text-[#8C6D23] font-semibold">
                {t("subtitle")}
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D3436]">
              {t("title")}
            </h1>
          </div>
          <p className="text-sm text-[#555E61] max-w-xl font-body">
            {t("description")}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white border border-[#E6E0D8] p-6 sm:p-8 rounded-[4px] space-y-6">
          <h2 className="font-heading text-xl font-bold text-[#2D3436] pb-3 border-b border-[#E6E0D8]">
            Scholarly Office Channels
          </h2>
          
          <div className="space-y-6">
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-[3px] bg-[#FAF8F5] border border-[#E6E0D8] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#1A4D2E]" />
               </div>
               <div>
                  <h3 className="font-heading font-bold text-sm text-[#2D3436] mb-1">Office Location</h3>
                  <p className="text-xs text-[#555E61] font-medium">{profile?.location || "Addis Ababa, Ethiopia"}</p>
                  <p className="text-xs text-[#7A8285] mt-1">Al-Fajr Islamic Foundation headquarters &amp; traditional teaching circle.</p>
               </div>
             </div>
             
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-[3px] bg-[#FAF8F5] border border-[#E6E0D8] flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-[#8C6D23]" />
               </div>
               <div>
                  <h3 className="font-heading font-bold text-sm text-[#2D3436] mb-1">Sharia Advisory Desk</h3>
                  <p className="text-xs text-[#555E61] font-medium">Wegagen Bank — Amanah Window Sharia Board</p>
                  <p className="text-xs text-[#7A8285] mt-1">AAOIFI standards governance and ethical banking audit inquiries.</p>
               </div>
             </div>

             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-[3px] bg-[#FAF8F5] border border-[#E6E0D8] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#1A4D2E]" />
               </div>
               <div>
                  <h3 className="font-heading font-bold text-sm text-[#2D3436] mb-1">Ask the Sheikh</h3>
                  <p className="text-xs text-[#555E61] font-medium mb-2">For personal religious inquiries, fatwa questions, and spiritual advice.</p>
                  <Link href="/ask" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#1A4D2E] text-white px-3.5 py-1.5 rounded-[3px] hover:bg-[#143d24]">
                    <span>Submit Inquiry</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B8860B]" />
                  </Link>
               </div>
             </div>
          </div>
        </div>

        <div className="bg-white border border-[#E6E0D8] p-6 sm:p-8 rounded-[4px] space-y-6">
          <h2 className="font-heading text-xl font-bold text-[#2D3436] pb-3 border-b border-[#E6E0D8]">
            Official Broadcast &amp; Social Archives
          </h2>
          <p className="text-xs text-[#555E61] leading-relaxed">
            Direct access to official channels broadcasting the Sheikh&apos;s lectures, short reminders, and weekly halaqat.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {socialsList.map((social, idx: number) => (
                <a 
                  key={idx} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-3.5 border border-[#E6E0D8] rounded-[3px] hover:border-[#1A4D2E] bg-[#FAF8F5] transition-colors group"
                >
                  <span className="font-heading font-bold text-xs text-[#2D3436] capitalize group-hover:text-[#1A4D2E]">{social.platform} Channel</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8C6D23] ms-auto" />
                </a>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
