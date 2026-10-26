"use client";

import { useState } from "react";
import { X, Calendar, MapPin, CheckCircle, Loader2, Users, Ticket, Printer } from "lucide-react";
import type { EventRegistrationRecord } from "@/lib/db/types";

export function EventRegistrationModal({
  eventId,
  eventSlug,
  eventTitle,
  startsAt,
  venueName,
  isOpen,
  onClose,
}: {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  startsAt: string;
  venueName?: string | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Addis Ababa");
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState<EventRegistrationRecord | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please provide your name and email address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          event_slug: eventSlug,
          event_title: eventTitle,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          city: city.trim() || undefined,
          attendees_count: attendeesCount,
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Registration failed");
      }

      const data = await res.json();
      setConfirmedRegistration(data.registration);
    } catch (err: any) {
      setError(err.message || "Failed to submit event registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#636E72] hover:text-[#2D3436] p-1 print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedRegistration ? (
          /* Confirmation Ticket Pass View */
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#1B5E20] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Attendance Confirmed
              </span>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#2D3436] mt-1.5">
                Seat Reserved Successfully!
              </h2>
              <p className="text-xs text-[#636E72] mt-1">
                Barakallahu Feekum. Your attendance has been registered with Sheikh Muhammed Ferej&apos;s event team.
              </p>
            </div>

            {/* Event Ticket Pass */}
            <div className="bg-[#FAF8F5] border-2 border-dashed border-[#1B5E20]/40 rounded-lg p-5 text-left space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-[#E0D8CE] pb-2">
                <span className="text-[11px] font-bold text-[#1B5E20] uppercase tracking-wider flex items-center gap-1">
                  <Ticket className="w-4 h-4 text-[#C5A059]" />
                  <span>Official Event Pass</span>
                </span>
                <span className="font-mono text-xs font-bold text-[#2D3436]">
                  {confirmedRegistration.id}
                </span>
              </div>

              <div>
                <h4 className="font-heading font-bold text-sm text-[#2D3436]">
                  {eventTitle}
                </h4>
                <div className="space-y-1 text-xs text-[#636E72] mt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#1B5E20]" />
                    <span>
                      {new Date(startsAt).toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {venueName && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{venueName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#636E72]" />
                    <span>
                      {confirmedRegistration.name} ({confirmedRegistration.attendees_count} {confirmedRegistration.attendees_count > 1 ? "attendees" : "attendee"})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#E0D8CE] hover:border-[#1B5E20] text-xs font-semibold rounded text-[#2D3436] transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#1B5E20]" />
                <span>Print Ticket</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form View */
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#1B5E20] flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-[#2D3436]">
                  Register for Event
                </h2>
                <p className="text-xs text-[#636E72]">
                  Reserve your attendee seat for this scheduled gathering
                </p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E0D8CE] p-3 rounded text-xs space-y-1">
              <p className="font-bold text-[#2D3436] truncate">{eventTitle}</p>
              <p className="text-[#636E72] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1B5E20]" />
                <span>
                  {new Date(startsAt).toLocaleString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D3436] mb-1">
                  Attendee Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dawud Mohammed"
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3436] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dawud@example.com"
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D3436] mb-1">
                    Phone / Telegram
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 91 ..."
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D3436] mb-1">
                    Number of Attendees
                  </label>
                  <select
                    value={attendeesCount}
                    onChange={(e) => setAttendeesCount(parseInt(e.target.value, 10))}
                    className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20] bg-white"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Person (Individual)" : `People (Group of ${n})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3436] mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Addis Ababa, Ethiopia"
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3436] mb-1">
                  Special Notes or Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Transport, elderly seating, etc..."
                  className="w-full text-xs px-3 py-2 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming Registration...</span>
                    </>
                  ) : (
                    <span>Confirm Event Reservation</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
