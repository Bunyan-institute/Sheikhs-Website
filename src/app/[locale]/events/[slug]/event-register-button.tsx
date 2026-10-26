"use client";

import { useState } from "react";
import { Ticket } from "lucide-react";
import { EventRegistrationModal } from "./event-registration-modal";

export function EventRegisterButton({
  eventId,
  eventSlug,
  eventTitle,
  startsAt,
  venueName,
  registrationRequired,
}: {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  startsAt: string;
  venueName?: string | null;
  registrationRequired?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs transition-colors cursor-pointer"
      >
        <Ticket className="w-4 h-4 text-[#C5A059]" />
        <span>{registrationRequired ? "Register to Attend (Required)" : "Reserve Attendee Seat"}</span>
      </button>

      <EventRegistrationModal
        eventId={eventId}
        eventSlug={eventSlug}
        eventTitle={eventTitle}
        startsAt={startsAt}
        venueName={venueName}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
