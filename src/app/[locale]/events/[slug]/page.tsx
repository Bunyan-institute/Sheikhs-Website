import { setRequestLocale } from 'next-intl/server';
import { getEvent, AUTHENTIC_EVENTS } from '@/lib/api/events';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Video, Clock, ArrowLeft, Users, Info } from 'lucide-react';
import { EventRegisterButton } from './event-register-button';

export async function generateStaticParams() {
  const locales = ["en", "ar", "am", "om"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const ev of AUTHENTIC_EVENTS) {
      params.push({ locale, slug: ev.slug });
    }
  }
  return params;
}

export default async function EventItemPage(props: { params: Promise<{ locale: string, slug: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  let event;
  try {
    event = await getEvent(params.slug, params.locale);
  } catch {
    return notFound();
  }

  if (!event) return notFound();

  const startDate = new Date(event.starts_at);
  const formattedDate = startDate.toLocaleDateString(params.locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = startDate.toLocaleTimeString(params.locale, { hour: 'numeric', minute: '2-digit', timeZoneName: 'long' });
  const isOnline = !!event.online_url;

  return (
    <article className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16">
      <Link href="/events" className="inline-flex items-center text-sm font-medium text-[#636E72] hover:text-[#1B5E20] transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180" />
        Back to Events Schedule
      </Link>

      <div className="bg-white border border-[#E0D8CE] rounded-md overflow-hidden">
        <div className="p-5 sm:p-8 md:p-12 border-b border-[#E0D8CE]">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#2D3436] mb-6 leading-tight break-words">
                {event.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-[#636E72]">
               <div className="flex items-center">
                  <Calendar className="w-5 h-5 me-3 text-[#1B5E20]" />
                  <span className="font-medium text-[#2D3436]">{formattedDate}</span>
               </div>
               <div className="flex items-center">
                  <Clock className="w-5 h-5 me-3 text-[#1B5E20]" />
                  <span className="font-medium text-[#2D3436]">{timeStr}</span>
               </div>
            </div>
        </div>

        <div className="bg-[#FAF8F5] p-5 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#E0D8CE]">
           <div>
              <h3 className="text-sm font-bold text-[#636E72] uppercase tracking-wider mb-4 flex items-center">
                 {isOnline ? <Video className="w-4 h-4 me-2" /> : <MapPin className="w-4 h-4 me-2" />}
                 Location
              </h3>
              <p className="text-lg font-medium text-[#2D3436] mb-1">
                 {isOnline ? 'Online Event' : (event.venue_name || 'Venue TBA')}
              </p>
              {isOnline && event.online_url ? (
                 <a href={event.online_url} className="text-[#1B5E20] hover:underline font-medium break-all" target="_blank" rel="noopener noreferrer">
                    {event.online_url}
                 </a>
              ) : (
                 <p className="text-[#636E72]">{event.venue_address}</p>
              )}
           </div>
           
           <div>
              <h3 className="text-sm font-bold text-[#636E72] uppercase tracking-wider mb-4 flex items-center">
                 <Users className="w-4 h-4 me-2" />
                 Attendance
              </h3>
              {event.capacity && (
                 <p className="text-[#2D3436] font-medium mb-1">Capacity: {event.capacity} attendees</p>
              )}
              {event.registration_required ? (
                 <div className="mt-3 bg-[#FFF8E1] border border-[#B8860B] text-[#B8860B] p-3 rounded flex items-start text-sm">
                    <Info className="w-4 h-4 me-2 shrink-0 mt-0.5" />
                    <span>Registration is required to attend this event. Please secure your spot.</span>
                 </div>
              ) : (
                 <p className="text-[#636E72] mt-1">Open attendance. No registration required.</p>
              )}

              <EventRegisterButton
                eventId={event.id}
                eventSlug={event.slug}
                eventTitle={event.title}
                startsAt={event.starts_at}
                venueName={event.venue_name}
                registrationRequired={event.registration_required}
              />
           </div>
        </div>

        <div className="p-5 sm:p-8 md:p-12">
            <h3 className="text-xl font-heading font-bold text-[#2D3436] mb-6">About this event</h3>
            <div className="prose prose-lg prose-headings:font-heading prose-headings:text-[#2D3436] prose-p:text-[#2D3436]/80 max-w-none font-body break-words">
                {event.description || event.summary}
            </div>
        </div>
      </div>
    </article>
  );
}
