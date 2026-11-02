import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getEvents } from '@/lib/api/events';
import { Link } from '@/i18n/navigation';
import { MapPin, Video, Clock, ArrowRight } from 'lucide-react';
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
    <div className="w-full">
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
              {t("details")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="space-y-5 sm:space-y-6">
          {eventList.map((event: PublicEvent) => {
            const startDate = new Date(event.starts_at);
            const month = startDate.toLocaleString(params.locale, { month: 'short' });
            const day = startDate.toLocaleString(params.locale, { day: 'numeric' });
            const year = startDate.getFullYear();
            const time = startDate.toLocaleString(params.locale, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
            const isOnline = !!event.online_url;
            
            return (
              <Link 
                key={event.id} 
                href={`/events/${event.slug}`} 
                className="group block bg-white rounded-2xl border border-[#0F241C]/10 overflow-hidden hover:border-[#1B6A50] transition-all shadow-xs p-5 sm:p-7"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                  {/* Arch-top Date block */}
                  <div className="shrink-0 w-20 sm:w-28 arch-top bg-[#BF9A45] text-[#072118] text-center pt-4 sm:pt-5 pb-3 sm:pb-4 shadow-sm">
                    <span className="font-display text-3xl sm:text-5xl font-bold leading-none block">{day}</span>
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider block mt-1">{month} {year}</span>
                  </div>

                  <div className="flex-grow min-w-0 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-display font-bold text-lg sm:text-2xl text-[#0F241C] group-hover:text-[#1B6A50] transition-colors break-words">
                        {event.title}
                      </h3>
                      {event.registration_required && (
                        <span className="self-start sm:self-auto shrink-0 bg-[#1B6A50]/10 text-[#1B6A50] border border-[#1B6A50]/20 text-[11px] font-semibold px-3 py-0.5 rounded-full whitespace-nowrap">
                          Registration Required
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#0F241C]/70 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#BF9A45]" />
                        <span>{time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isOnline ? (
                          <>
                            <Video className="w-3.5 h-3.5 text-[#1B6A50]" />
                            <span>Online Live Broadcast</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-[#BF9A45]" />
                            <span>{event.venue_name || "Addis Ababa, Ethiopia"}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#BF9A45] group-hover:text-[#1B6A50] transition-colors">
                      <span>Event Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
