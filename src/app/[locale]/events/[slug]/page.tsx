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
    <article className="w-full bg-[#EDF2EE] py-10 md:py-16">
      <div className="max-w-page mx-auto px-4 sm:px-6">
        <Link href="/events" className="inline-flex items-center text-sm font-semibold text-[#1D6A5A] hover:text-[#0F3446] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 me-2 text-[#BF9A45] rtl:rotate-180" />
          Back to Events Schedule
        </Link>

        <div className="bg-white border border-[#14262E]/10 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-6 sm:p-10 border-b border-[#14262E]/10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#14262E] mb-6 leading-tight break-words">
              {event.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm text-[#14262E]/70">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 me-2.5 text-[#BF9A45]" />
                <span className="font-semibold text-[#14262E]">{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 me-2.5 text-[#1D6A5A]" />
                <span className="font-medium">{timeStr}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#14262E]/10 bg-[#EDF2EE]/40">
            <div className="bg-white p-6 rounded-xl border border-[#14262E]/10 shadow-2xs">
              <h3 className="text-xs font-bold text-[#1D6A5A] uppercase tracking-wider mb-3 flex items-center">
                {isOnline ? <Video className="w-4 h-4 me-2 text-[#BF9A45]" /> : <MapPin className="w-4 h-4 me-2 text-[#BF9A45]" />}
                Location &amp; Venue
              </h3>
              <p className="text-lg font-display font-semibold text-[#14262E] mb-1">
                {isOnline ? 'Online Gathering' : (event.venue_name || 'Venue TBA')}
              </p>
              {isOnline && event.online_url ? (
                <a href={event.online_url} className="text-[#1D6A5A] hover:underline font-medium break-all text-sm" target="_blank" rel="noopener noreferrer">
                  {event.online_url}
                </a>
              ) : (
                <p className="text-xs text-[#14262E]/70 mt-1">{event.venue_address}</p>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-[#14262E]/10 shadow-2xs">
              <h3 className="text-xs font-bold text-[#1D6A5A] uppercase tracking-wider mb-3 flex items-center">
                <Users className="w-4 h-4 me-2 text-[#BF9A45]" />
                Attendance &amp; Registration
              </h3>
              {event.capacity && (
                <p className="text-[#14262E] font-medium text-sm mb-2">Capacity: {event.capacity} attendees</p>
              )}
              {event.registration_required ? (
                <div className="mt-2 bg-[#EDF2EE] border border-[#BF9A45]/40 text-[#14262E] p-3 rounded-xl flex items-start text-xs leading-relaxed">
                  <Info className="w-4 h-4 me-2 shrink-0 mt-0.5 text-[#BF9A45]" />
                  <span>Registration is required to attend this seminar. Please secure your attendance below.</span>
                </div>
              ) : (
                <p className="text-xs text-[#14262E]/70 mt-1">Open halaqah attendance. No advance registration required.</p>
              )}

              <div className="mt-4">
                <EventRegisterButton
                  eventId={event.id}
                  eventSlug={event.slug}
                  eventTitle={event.title}
                  startsAt={event.starts_at}
                />
              </div>
            </div>
          </div>

          {event.description && (
            <div className="p-6 sm:p-10">
              <h3 className="font-display text-2xl font-bold text-[#14262E] mb-4">About this Seminar</h3>
              <p className="text-[#14262E]/80 font-sans leading-relaxed text-base break-words">
                {event.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}