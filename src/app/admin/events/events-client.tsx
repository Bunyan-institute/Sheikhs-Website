"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  CheckCircle,
  Tag,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import { saveEventAction, deleteEventAction } from "../actions";
import type { PublicEvent } from "@/lib/api/types";
import type { EventRegistrationRecord } from "@/lib/db/types";

function toDatetimeLocal(isoString?: string | null): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  } catch {
    return "";
  }
}

export function EventsClient({
  initialEvents,
  initialRegistrations = [],
}: {
  initialEvents: PublicEvent[];
  initialRegistrations?: EventRegistrationRecord[];
}) {
  const [events, setEvents] = useState<PublicEvent[]>(initialEvents);
  const [registrations] = useState<EventRegistrationRecord[]>(initialRegistrations);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState<PublicEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PublicEvent | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [categories, setCategories] = useState("khutbah");
  const [coverUrl, setCoverUrl] = useState("");

  const filteredEvents = events.filter((e) => {
    const q = searchTerm.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      (e.venue_name && e.venue_name.toLowerCase().includes(q)) ||
      (e.summary && e.summary.toLowerCase().includes(q))
    );
  });

  const openNewModal = () => {
    setEditingEvent(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setDescription("");
    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + ((5 + 7 - nextFriday.getDay()) % 7 || 7));
    nextFriday.setHours(12, 30, 0, 0);
    setStartsAt(toDatetimeLocal(nextFriday.toISOString()));
    const ends = new Date(nextFriday);
    ends.setHours(14, 0, 0, 0);
    setEndsAt(toDatetimeLocal(ends.toISOString()));
    setVenueName("Anwar Grand Mosque");
    setVenueAddress("Merkato, Addis Ababa, Ethiopia");
    setOnlineUrl("");
    setRegistrationRequired(false);
    setCategories("khutbah, jummah");
    setCoverUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (evt: PublicEvent) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setSlug(evt.slug);
    setSummary(evt.summary || "");
    setDescription(evt.description || "");
    setStartsAt(toDatetimeLocal(evt.starts_at));
    setEndsAt(toDatetimeLocal(evt.ends_at));
    setVenueName(evt.venue_name || "");
    setVenueAddress(evt.venue_address || "");
    setOnlineUrl(evt.online_url || "");
    setRegistrationRequired(evt.registration_required);
    setCategories(evt.categories?.join(", ") || "khutbah");
    setCoverUrl(evt.cover?.url || "");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingEvent) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 45) || `evt-${Date.now()}`
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startsAt) {
      alert("Title and start time are required.");
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await saveEventAction({
        id: editingEvent?.id,
        title,
        slug,
        summary,
        description,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
        venueName: venueName || undefined,
        venueAddress: venueAddress || undefined,
        onlineUrl: onlineUrl || undefined,
        registrationRequired,
        categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
        coverUrl: coverUrl || undefined,
      });

      if (editingEvent) {
        setEvents((prev) => prev.map((item) => (item.id === editingEvent.id ? res.event : item)));
      } else {
        setEvents((prev) => [res.event, ...prev]);
      }

      setIsModalOpen(false);
      setFeedback("Event saved successfully and scheduled!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, eTitle: string) => {
    if (!confirm(`Are you sure you want to delete event "${eTitle}"?`)) return;
    try {
      await deleteEventAction(id);
      setEvents((prev) => prev.filter((item) => item.id !== id));
      setFeedback(`Event "${eTitle}" deleted.`);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            Events & Khutbah Schedule ({events.length})
          </h1>
          <p className="text-xs text-[#636E72] mt-0.5">
            Manage upcoming Friday Khutbahs, Islamic seminars, regional visits, and online live streams.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#E0D8CE] rounded-lg p-3">
        <input
          type="text"
          placeholder="Search by event title, mosque name, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
        />
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => {
          const startDate = new Date(evt.starts_at);
          const isUpcoming = startDate.getTime() > Date.now();
          const eventAttendees = registrations.filter(
            (r) => r.event_id === evt.id || r.event_slug === evt.slug
          );

          return (
            <div
              key={evt.id}
              className="bg-white border border-[#E0D8CE] rounded-lg p-5 flex flex-col justify-between shadow-2xs hover:border-[#1B5E20] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isUpcoming
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-[#F5F1EB] text-[#636E72]"
                    }`}
                  >
                    {isUpcoming ? "Upcoming" : "Past Event"}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#636E72]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-base text-[#2D3436] line-clamp-2 mb-2">
                  {evt.title}
                </h3>

                <div className="space-y-1.5 text-xs text-[#636E72] mb-3">
                  <div className="flex items-center gap-2 text-[#1B5E20] font-medium">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {startDate.toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {evt.venue_name && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[#C5A059]" />
                      <span className="truncate">{evt.venue_name}</span>
                    </div>
                  )}

                  {evt.online_url && (
                    <div className="flex items-center gap-2 text-sky-700">
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <a
                        href={evt.online_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate hover:underline"
                      >
                        Online Stream / Zoom
                      </a>
                    </div>
                  )}
                </div>

                {evt.summary && (
                  <p className="text-xs text-[#636E72] line-clamp-2 mb-4 bg-[#FBF9F5] p-2.5 rounded border border-[#F0EAE1]">
                    {evt.summary}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mb-4">
                  {evt.categories?.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-0.5 text-[10px] bg-[#F5F1EB] text-[#2D3436] px-2 py-0.5 rounded"
                    >
                      <Tag className="w-2.5 h-2.5 text-[#C5A059]" />
                      {cat}
                    </span>
                  ))}
                  {evt.registration_required && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded">
                      Registration Required
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#F0EAE1] mt-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/events/${evt.slug}`}
                    target="_blank"
                    className="text-xs text-[#1B5E20] hover:text-[#154a19] font-medium inline-flex items-center gap-1"
                  >
                    <span>Public View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => setSelectedEventForAttendees(evt)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1B5E20] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    title="View registered attendees"
                  >
                    <Users className="w-3 h-3 text-[#C5A059]" />
                    <span>{eventAttendees.length} Registered</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(evt)}
                    className="p-1.5 text-[#636E72] hover:text-[#1B5E20] hover:bg-[#F5F1EB] rounded transition-colors"
                    title="Edit Event"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id, evt.title)}
                    className="p-1.5 text-[#636E72] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="col-span-full py-12 text-center text-[#636E72] bg-white border border-[#E0D8CE] rounded-lg">
            No events found matching your filter. Click &ldquo;New Event&rdquo; to schedule one.
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-[#E0D8CE] pb-3">
              <h2 className="font-heading font-bold text-lg text-[#2D3436]">
                {editingEvent ? "Edit Scheduled Event" : "Schedule New Event"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#636E72] hover:text-[#2D3436]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Friday Khutbah: Sincerity in Deeds (Ikhlas)"
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Categories (comma separated)
                  </label>
                  <input
                    type="text"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    placeholder="khutbah, jummah, adama"
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    End Date & Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Mosque / Venue Name
                  </label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g. Anwar Grand Mosque"
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Venue Address / City
                  </label>
                  <input
                    type="text"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="e.g. Merkato, Addis Ababa"
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Online Stream Link (Zoom / YouTube Live)
                  </label>
                  <input
                    type="url"
                    value={onlineUrl}
                    onChange={(e) => setOnlineUrl(e.target.value)}
                    placeholder="https://youtube.com/live/..."
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                    Cover Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="/images/hero-bg.jpg"
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="regReq"
                  checked={registrationRequired}
                  onChange={(e) => setRegistrationRequired(e.target.checked)}
                  className="rounded text-[#1B5E20] focus:ring-[#1B5E20]"
                />
                <label htmlFor="regReq" className="text-xs font-medium text-[#2D3436] cursor-pointer">
                  Advance attendee registration required for this event
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Brief Summary
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short description for schedule cards..."
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Detailed Description (Optional)
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full agenda, transport details, parking instructions..."
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E0D8CE]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#636E72] hover:bg-[#F5F1EB] rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingEvent ? "Update Event" : "Create Event"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Attendee Roster Modal */}
      {selectedEventForAttendees && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-[#E0D8CE] pb-3">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#2D3436]">
                  Registered Attendees
                </h2>
                <p className="text-xs text-[#636E72]">
                  {selectedEventForAttendees.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedEventForAttendees(null)}
                className="text-[#636E72] hover:text-[#2D3436]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-[#F0EAE1] max-h-96 overflow-y-auto">
              {registrations
                .filter(
                  (r) =>
                    r.event_id === selectedEventForAttendees.id ||
                    r.event_slug === selectedEventForAttendees.slug
                )
                .map((attendee) => (
                  <div key={attendee.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-heading font-bold text-sm text-[#2D3436]">
                        {attendee.name}
                      </div>
                      <div className="text-xs text-[#636E72] flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#636E72]" />
                          {attendee.email}
                        </span>
                        {attendee.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#1B5E20]" />
                            {attendee.phone}
                          </span>
                        )}
                        {attendee.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#C5A059]" />
                            {attendee.city}
                          </span>
                        )}
                      </div>
                      {attendee.notes && (
                        <p className="text-[11px] text-[#636E72] italic bg-[#FAF8F5] p-1.5 rounded">
                          &ldquo;{attendee.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block bg-[#FAF8F5] border border-[#E0D8CE] text-xs font-semibold px-2 py-0.5 rounded text-[#1B5E20]">
                        {attendee.attendees_count} {attendee.attendees_count > 1 ? "Seats" : "Seat"}
                      </span>
                      <span className="block text-[10px] text-[#636E72] font-mono mt-1">
                        {attendee.id}
                      </span>
                    </div>
                  </div>
                ))}

              {registrations.filter(
                (r) =>
                  r.event_id === selectedEventForAttendees.id ||
                  r.event_slug === selectedEventForAttendees.slug
              ).length === 0 && (
                <div className="py-8 text-center text-xs text-[#636E72]">
                  No attendees have registered for this event yet.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#E0D8CE]">
              <button
                onClick={() => setSelectedEventForAttendees(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#FAF8F5] hover:bg-[#F5F1EB] text-[#2D3436] rounded border border-[#E0D8CE]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
