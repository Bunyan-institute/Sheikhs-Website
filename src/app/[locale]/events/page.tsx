import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getEvents } from '@/lib/api/events';
import { Link } from '@/i18n/navigation';
import { Calendar, MapPin, Video, Clock, ArrowRight } from 'lucide-react';
import type { PublicEvent } from '@/lib/api/types';

export default async function EventsPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "events" });

  let eventList: PublicEvent[] = [];
  try {
    const events = await getEvents({ locale: params.locale });
    eventList = events?.data || [];
  } catch (err) {
    console.error("Failed to load events", err);
  }

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
            {t("details")}
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {eventList.map((event: PublicEvent) => {
          const startDate = new Date(event.starts_at);
          const month = startDate.toLocaleString(params.locale, { month: 'short' });
          const day = startDate.toLocaleString(params.locale, { day: 'numeric' });
          const time = startDate.toLocaleString(params.locale, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
          const isOnline = !!event.online_url;
          
          return (
          <Link key={event.id} href={`/events/${event.slug}`} className="group block bg-white rounded-[4px] border border-[#E6E0D8] overflow-hidden hover:border-[#1A4D2E] transition-colors">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-44 bg-[#FAF8F5] flex flex-col items-center justify-center p-6 border-b sm:border-b-0 sm:border-e border-[#E6E0D8] shrink-0">
                <span className="text-xs font-bold text-[#1A4D2E] uppercase tracking-wider">{month}</span>
                <span className="text-3xl font-heading font-black text-[#2D3436] mt-1 mb-1">{day}</span>
                <div className="flex items-center text-[11px] text-[#7A8285] font-medium">
                  <Clock className="w-3 h-3 me-1 text-[#8C6D23]" />
                  <span>{time}</span>
                </div>
              </div>
              <div className="p-5 sm:p-6 flex flex-col justify-center flex-grow min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                  <h3 className="font-heading font-bold text-base sm:text-lg md:text-xl text-[#2D3436] group-hover:text-[#1A4D2E] transition-colors break-words">
                    {event.title}
                  </h3>
                  {event.registration_required && (
                    <span className="self-start sm:self-auto shrink-0 bg-[#FAF8F5] text-[#8C6D23] border border-[#B8860B]/40 text-[11px] font-bold px-2.5 py-0.5 rounded-[2px] whitespace-nowrap">
                      Registration Required
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-[#555E61] pt-1">
                  <div className="flex items-center">
                    {isOnline ? (
                      <>
                        <Video className="w-3.5 h-3.5 me-1.5 text-[#1A4D2E]" />
                        <span>Online Live Broadcast</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5 me-1.5 text-[#8C6D23]" />
                        <span>{event.venue_name || "Addis Ababa, Ethiopia"}</span>
                      </>
                    )}
                  </div>
                  <span className="text-[#8C6D23] font-semibold flex items-center gap-1 group-hover:text-[#1A4D2E]">
                    <span>Event Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )})}
      </div>
      
      {eventList.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[4px] border border-[#E6E0D8]">
          <Calendar className="w-12 h-12 text-[#7A8285]/50 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-[#2D3436] mb-1">No upcoming scheduled events</h3>
          <p className="text-[#7A8285] text-xs">Announcements for upcoming halaqat and Dawrahs will be posted here.</p>
        </div>
      )}
    </div>
  );
}
