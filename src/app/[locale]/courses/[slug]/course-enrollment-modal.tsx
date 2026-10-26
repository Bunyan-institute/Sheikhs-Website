"use client";

import { useState } from "react";
import { X, GraduationCap, Loader2, CheckCircle } from "lucide-react";
import type { CourseEnrollmentRecord } from "@/lib/db/types";

export function CourseEnrollmentModal({
  courseId,
  courseSlug,
  courseTitle,
  isOpen,
  onClose,
  onSuccess,
}: {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (enrollment: CourseEnrollmentRecord) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Addis Ababa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Full name and email address are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          course_slug: courseSlug,
          course_title: courseTitle,
          student_name: name.trim(),
          student_email: email.trim(),
          student_phone: phone.trim() || undefined,
          city: city.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to complete enrollment");
      }

      const data = await res.json();
      onSuccess(data.enrollment);
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred during enrollment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#636E72] hover:text-[#2D3436] p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#1B5E20] flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-[#2D3436]">
              Enroll in Islamic Course
            </h2>
            <p className="text-xs text-[#636E72]">
              Free enrollment with official certificate upon exam completion
            </p>
          </div>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E0D8CE] p-3 rounded text-xs text-[#2D3436] font-semibold">
          Program: {courseTitle}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2D3436] mb-1">
              Full Legal Name (as it will appear on your Certificate) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmad Ibn Yusuf al-Habashi"
              className="w-full text-xs px-3 py-2.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
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
              placeholder="ahmad@example.com"
              className="w-full text-xs px-3 py-2.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
            />
            <p className="text-[10px] text-[#636E72] mt-0.5">
              Your exam results and certificate verification token will be associated with this email.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2D3436] mb-1">
                Phone Number / WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 91 ..."
                className="w-full text-xs px-3 py-2.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2D3436] mb-1">
                City / Country
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Addis Ababa, Ethiopia"
                className="w-full text-xs px-3 py-2.5 border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20]"
              />
            </div>
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
                  <span>Registering Enrollment...</span>
                </>
              ) : (
                <span>Complete Enrollment & Begin Studies</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
