import { setRequestLocale } from 'next-intl/server';
import { getProfile } from '@/lib/api/profile';
import { Link } from '@/i18n/navigation';
import { MapPin, Globe, MessageSquare } from 'lucide-react';

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const profile = await getProfile(params.locale).catch(() => null);
  const socialsList = profile?.socials 
    ? Object.entries(profile.socials).map(([platform, url]) => ({ platform, url }))
    : [];

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16 lg:py-24">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-heading text-[#2D3436] font-bold tracking-tight mb-4">
          Contact & Connect
        </h1>
        <p className="text-lg md:text-xl text-[#636E72] max-w-2xl mx-auto font-body">
          Reach out for inquiries, media requests, or spiritual guidance.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
        <div className="bg-[#FAF8F5] border border-[#E0D8CE] p-5 sm:p-8 rounded-lg">
          <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-6">Direct Channels</h2>
          
          <div className="space-y-6">
             <div className="flex items-start">
               <div className="w-10 h-10 rounded-full bg-white border border-[#E0D8CE] flex items-center justify-center shrink-0 me-4 shadow-sm">
                  <MapPin className="w-5 h-5 text-[#1B5E20]" />
               </div>
               <div>
                  <h3 className="font-bold text-[#2D3436] text-sm uppercase tracking-wider mb-1">Office Location</h3>
                  <p className="text-[#636E72] font-medium">{profile?.location || "Addis Ababa, Ethiopia"}</p>
                  <p className="text-sm text-[#636E72]/70 mt-1">Official scholarly office and primary teaching institute.</p>
               </div>
             </div>
             
             <div className="flex items-start">
               <div className="w-10 h-10 rounded-full bg-white border border-[#E0D8CE] flex items-center justify-center shrink-0 me-4 shadow-sm">
                  <MessageSquare className="w-5 h-5 text-[#1B5E20]" />
               </div>
               <div>
                  <h3 className="font-bold text-[#2D3436] text-sm uppercase tracking-wider mb-1">Ask the Sheikh</h3>
                  <p className="text-[#636E72] font-medium mb-2">For religious questions and fatwas.</p>
                  <Link href="/ask" className="inline-block text-sm font-bold bg-[#1B5E20] text-white px-4 py-2 rounded hover:bg-[#1B5E20]/90 transition-colors">
                    Submit a Question
                  </Link>
               </div>
             </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-6">Official Social Media</h2>
          <p className="text-[#636E72] font-body mb-8">
            Follow the Sheikh on official platforms for the latest lectures, announcements, and short reminders.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {socialsList.map((social, idx: number) => (
                <a 
                  key={idx} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-4 border border-[#E0D8CE] rounded hover:border-[#1B5E20] hover:bg-[#FAF8F5] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E0D8CE] flex items-center justify-center me-3 group-hover:bg-[#1B5E20] group-hover:text-white transition-colors">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[#2D3436] capitalize">{social.platform}</span>
                </a>
             ))}
             {!socialsList.length && (
                <div className="col-span-2 p-6 border border-[#E0D8CE] border-dashed rounded text-center text-[#636E72]">
                   Verified social channels will be updated soon.
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
