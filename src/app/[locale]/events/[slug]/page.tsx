import { setRequestLocale } from 'next-intl/server';
import { getEvent } from '@/lib/api/events';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { Calendar, Clock, MapPin, Video, Users, ArrowLeft, Info } from 'lucide-react';
import { getSiteUrl, buildEventSchema, buildBreadcrumbSchema, buildHreflangAlternates } from '@/lib/seo';
import { JsonLd } from '@/components/seo/json-ld';
import type { Metadata } from 'next';
import { EventRegisterButton } from './event-register-button';

interface EventDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const event = await getEvent(slug, locale).catch(() => null);
  const siteUrl = getSiteUrl();

  if (!event) {
    return { title: 'Event Details | Sheikh Muhammed Ferej' };
  }

  const pageUrl = `${siteUrl}/${locale}/events/${slug}`;
  const description = event.summary || `Join Islamic gathering: ${event.title} with Sheikh Muhammed Ferej Megeno.`;

  return {
    title: `${event.title} | Sheikh Muhammed Ferej Megeno`,
    description,
    alternates: buildHreflangAlternates(`/events/${slug}`, locale),
    openGraph: {
      type: "article",
      title: `${event.title} | Sheikh Muhammed Ferej Megeno`,
      description,
      url: pageUrl,
      images: [{ url: `${siteUrl}/images/sheikh-portrait.jpg`, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | Sheikh Muhammed Ferej Megeno`,
      description,
      images: [`${siteUrl}/images/sheikh-portrait.jpg`],
    },
  };
}

export default async function EventDetailPage(props: EventDetailPageProps) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const event = await getEvent(params.slug, params.locale).catch(() => null);
  if (!event) notFound();

  const startDate = new Date(event.starts_at);
  const formattedDate = startDate.toLocaleDateString(params.locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = startDate.toLocaleTimeString(params.locale, { hour: 'numeric', minute: '2-digit', timeZoneName: 'long' });
  const isOnline = !!event.online_url;
  const siteUrl = getSiteUrl();

  const breadcrumbs = [
    { name: "Home", url: `${siteUrl}/${params.locale}` },
    { name: "Events", url: `${siteUrl}/${params.locale}/events` },
    { name: event.title, url: `${siteUrl}/${params.locale}/events/${event.slug}` },
  ];

  return (
    <article className="w-full bg-[#EDF4F0] py-8 sm:py-12 md:py-16">
      <JsonLd data={[buildEventSchema(event, params.locale), buildBreadcrumbSchema(breadcrumbs)]} />
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/events" className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#1B6A50] hover:text-[#0D3E2F] transition-colors mb-6 sm:mb-8 py-1">
          <ArrowLeft className="w-4 h-4 me-2 text-[#BF9A45] rtl:rotate-180" />
          <span>Back to Events Schedule</span>
        </Link>

        <div className="bg-white border border-[#0F241C]/10 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 sm:p-8 md:p-10 border-b border-[#0F241C]/10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#0F241C] mb-4 sm:mb-6 leading-tight break-words">
              {event.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 text-xs sm:text-sm text-[#0F241C]/75">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 me-2.5 text-[#BF9A45]" />
                <span className="font-semibold text-[#0F241C]">{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 me-2.5 text-[#1B6A50]" />
                <span className="font-medium">{timeStr}</span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 border-b border-[#0F241C]/10 bg-[#EDF4F0]/40">
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#0F241C]/10 shadow-2xs">
              <h3 className="text-xs font-bold text-[#1B6A50] uppercase tracking-wider mb-3 flex items-center">
                {isOnline ? <Video className="w-4 h-4 me-2 text-[#BF9A45]" /> : <MapPin className="w-4 h-4 me-2 text-[#BF9A45]" />}
                Location &amp; Venue
              </h3>
              <p className="text-base sm:text-lg font-display font-semibold text-[#0F241C] mb-1">
                {isOnline ? 'Online Gathering' : (event.venue_name || 'Venue TBA')}
              </p>
              {isOnline && event.online_url ? (
                <a href={event.online_url} className="text-[#1B6A50] hover:underline font-medium break-all text-xs sm:text-sm" target="_blank" rel="noopener noreferrer">
                  {event.online_url}
                </a>
              ) : (
                <p className="text-xs text-[#0F241C]/70 mt-1">{event.venue_address}</p>
              )}
            </div>
            
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#0F241C]/10 shadow-2xs">
              <h3 className="text-xs font-bold text-[#1B6A50] uppercase tracking-wider mb-3 flex items-center">
                <Users className="w-4 h-4 me-2 text-[#BF9A45]" />
                Attendance &amp; Registration
              </h3>
              {event.capacity && (
                <p className="text-[#0F241C] font-medium text-xs sm:text-sm mb-2">Capacity: {event.capacity} attendees</p>
              )}
              {event.registration_required ? (
                <div className="mt-2 bg-[#EDF4F0] border border-[#BF9A45]/40 text-[#0F241C] p-3 rounded-xl flex items-start text-xs leading-relaxed">
                  <Info className="w-4 h-4 me-2 shrink-0 mt-0.5 text-[#BF9A45]" />
                  <span>Registration is required to attend this seminar. Please secure your attendance below.</span>
                </div>
              ) : (
                <p className="text-xs text-[#0F241C]/70 mt-1">Open halaqah attendance. No advance registration required.</p>
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
            <div className="p-5 sm:p-8 md:p-10">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0F241C] mb-4">About this Seminar</h3>
              <p className="text-[#0F241C]/80 font-sans leading-relaxed text-sm sm:text-base break-words">
                {event.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
