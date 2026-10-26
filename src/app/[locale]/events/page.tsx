import { setRequestLocale } from 'next-intl/server';
import { getEvents } from '@/lib/api/events';
import { Link } from '@/i18n/navigation';
import { Calendar, MapPin, Video, Clock } from 'lucide-react';
import type { PublicEvent } from '@/lib/api/types';

export default async function EventsPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);

  let eventList: PublicEvent[] = [];
  try {
    const events = await getEvents({ locale: params.locale });
    eventList = events?.data || [];
  } catch (err) {
    console.error("Failed to load events", err);
  }

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-12 md:py-16 lg:py-24">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading text-[#2D3436] font-bold tracking-tight mb-4">
          Events Schedule
        </h1>
        <p className="text-lg md:text-xl text-[#636E72] font-body">
          Upcoming classes, lectures, and gatherings.
        </p>
      </header>

      <div className="space-y-6">
        {eventList.map((event: PublicEvent) => {
          const startDate = new Date(event.starts_at);
          const month = startDate.toLocaleString(params.locale, { month: 'short' });
          const day = startDate.toLocaleString(params.locale, { day: 'numeric' });
          const time = startDate.toLocaleString(params.locale, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
          const isOnline = !!event.online_url;
          
          return (
          <Link key={event.id} href={`/events/${event.slug}`} className="group block bg-white rounded-md border border-[#E0D8CE] overflow-hidden hover:border-[#1B5E20] transition-colors duration-200">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 bg-[#FAF8F5] flex flex-col items-center justify-center p-6 border-b sm:border-b-0 sm:border-e border-[#E0D8CE] shrink-0">
                <span className="text-sm font-bold text-[#1B5E20] uppercase tracking-wider">{month}</span>
                <span className="text-4xl font-heading font-black text-[#2D3436] mt-1 mb-2">{day}</span>
                <div className="flex items-center text-xs text-[#636E72] font-medium mt-1">
                  <Clock className="w-3.5 h-3.5 me-1" />
                  {time}
                </div>
              </div>
              <div className="p-5 sm:p-8 flex flex-col justify-center flex-grow min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-[#2D3436] group-hover:text-[#1B5E20] transition-colors break-words">
                    {event.title}
                  </h3>
                  {event.registration_required && (
                    <span className="self-start sm:self-auto shrink-0 bg-[#FFF8E1] text-[#B8860B] border border-[#B8860B] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      Registration Required
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm font-medium text-[#636E72]">
                  {isOnline ? (
                    <>
                      <Video className="w-4 h-4 me-2 text-[#1B5E20]" />
                      Online Event
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 me-2 text-[#1B5E20]" />
                      {event.venue_name || "Venue TBA"}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )})}
      </div>
      
      {eventList.length === 0 && (
        <div className="text-center py-20 bg-[#FAF8F5] rounded-md border border-[#E0D8CE]">
          <Calendar className="w-12 h-12 text-[#636E72]/50 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-[#2D3436] mb-2">No upcoming events</h3>
          <p className="text-[#636E72]">Please check back later for updates to the schedule.</p>
        </div>
      )}
    </div>
  );
}
