"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { CertificateView } from "@/components/certificate/certificate-view";
import { CourseEnrollmentModal } from "./course-enrollment-modal";
import type { PublicCourse } from "@/lib/api/types";
import type {
  CourseEnrollmentRecord,
  CourseExamConfig,
  IssuedCertificateRecord,
} from "@/lib/db/types";

export function CourseLearningView({
  course,
  initialExam,
  initialEnrollment,
  initialCertificate,
}: {
  course: PublicCourse;
  initialExam?: CourseExamConfig | null;
  initialEnrollment?: CourseEnrollmentRecord | null;
  initialCertificate?: IssuedCertificateRecord | null;
}) {
  const t = useTranslations("courseDetail");

  const [enrollment, setEnrollment] = useState<CourseEnrollmentRecord | null>(
    initialEnrollment || null
  );
  const [certificate, setCertificate] = useState<IssuedCertificateRecord | null>(
    initialCertificate || null
  );
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"lessons" | "exam">("lessons");

  // Lessons completion state
  const [completedLessons, setCompletedLessons] = useState<string[]>(
    initialEnrollment?.completed_lessons || []
  );

  // Exam state
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  const [examResult, setExamResult] = useState<{
    score: number;
    passed: boolean;
    correct_count: number;
    total_questions: number;
  } | null>(null);
  const [examError, setExamError] = useState<string | null>(null);

  const lessons = course.lessons || [];
  const examQuestions = initialExam?.questions || [];

  const toggleLesson = (lessonId: string) => {
    if (!enrollment) {
      setIsEnrollModalOpen(true);
      return;
    }
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollment) {
      setIsEnrollModalOpen(true);
      return;
    }

    if (Object.keys(answers).length < examQuestions.length) {
      setExamError(`Please answer all ${examQuestions.length} questions before submitting.`);
      return;
    }

    setIsSubmittingExam(true);
    setExamError(null);

    try {
      const res = await fetch("/api/courses/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: course.slug,
          student_email: enrollment.student_email,
          student_name: enrollment.student_name,
          answers,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Exam grading failed");
      }

      const data = await res.json();
      setExamResult({
        score: data.score,
        passed: data.passed,
        correct_count: data.correct_count,
        total_questions: data.total_questions,
      });

      if (data.certificate) {
        setCertificate(data.certificate);
      }
      if (data.enrollment) {
        setEnrollment(data.enrollment);
      }
    } catch (err: any) {
      setExamError(err.message || "Failed to submit exam.");
    } finally {
      setIsSubmittingExam(false);
    }
  };

  const progressPercentage =
    lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Student Enrollment Bar */}
      <div className="bg-white border border-[#E0D8CE] rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-[#1B5E20] flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              {enrollment ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {t("enrolled")}
                    </span>
                    {certificate && (
                      <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#C5A059]/40 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>{t("completed")}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#2D3436] mt-0.5">
                    {enrollment.student_name}
                  </h3>
                  <p className="text-xs text-[#636E72]">{enrollment.student_email}</p>
                </>
              ) : (
                <>
                  <h3 className="font-heading font-bold text-base text-[#2D3436]">
                    {t("enroll")}
                  </h3>
                  <p className="text-xs text-[#636E72]">
                    {t("certificateIncluded")}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {enrollment ? (
              <div className="w-full sm:w-48 text-left md:text-right">
                <div className="flex items-center justify-between text-xs text-[#636E72] mb-1">
                  <span>{t("progress")}</span>
                  <span className="font-bold text-[#1B5E20]">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-[#F5F1EB] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1B5E20] h-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#636E72] mt-0.5 block">
                  {completedLessons.length} / {lessons.length} {t("lessons")}
                </span>
              </div>
            ) : (
              <button
                onClick={() => setIsEnrollModalOpen(true)}
                className="px-5 py-2.5 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs transition-colors cursor-pointer"
              >
                {t("enroll")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E0D8CE] gap-2">
        <button
          onClick={() => setActiveTab("lessons")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "lessons"
              ? "border-[#1B5E20] text-[#1B5E20]"
              : "border-transparent text-[#636E72] hover:text-[#2D3436]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t("lessons")} ({lessons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("exam")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "exam"
              ? "border-[#1B5E20] text-[#1B5E20]"
              : "border-transparent text-[#636E72] hover:text-[#2D3436]"
          }`}
        >
          <Award className="w-4 h-4 text-[#C5A059]" />
          <span>{t("certificateIncluded")}</span>
        </button>
      </div>

      {/* Tab 1: Lessons Checklist */}
      {activeTab === "lessons" && (
        <div className="space-y-4">
          <div className="bg-[#FAF8F5] border border-[#E0D8CE] p-4 rounded text-xs text-[#636E72] flex items-center justify-between">
            <span>
              {t("completeLesson")}
            </span>
            {enrollment && (
              <button
                onClick={() => setActiveTab("exam")}
                className="text-[#1B5E20] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>{t("continueLearning")}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {lessons.map((lesson, idx) => {
              const isDone = completedLessons.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => toggleLesson(lesson.id)}
                  className={`bg-white border rounded-lg p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                    isDone
                      ? "border-emerald-300 bg-emerald-50/20"
                      : "border-[#E0D8CE] hover:border-[#1B5E20]"
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-emerald-700 shrink-0"
                    title={isDone ? t("completed") : t("completeLesson")}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#E0D8CE] hover:text-[#1B5E20]" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4
                        className={`font-heading font-semibold text-sm ${
                          isDone ? "text-emerald-950 line-through opacity-80" : "text-[#2D3436]"
                        }`}
                      >
                        {lesson.position || idx + 1}. {lesson.title}
                      </h4>
                      {lesson.duration_seconds && (
                        <span className="text-[11px] text-[#636E72] font-mono shrink-0">
                          {Math.floor(lesson.duration_seconds / 60)} mins
                        </span>
                      )}
                    </div>
                    {lesson.summary && (
                      <p className="text-xs text-[#636E72] mt-1 line-clamp-2">
                        {lesson.summary}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Exam & Certificate */}
      {activeTab === "exam" && (
        <div className="space-y-6">
          {/* If certificate already earned, show certificate! */}
          {certificate ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-lg p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="font-heading font-bold text-base text-emerald-950">
                      {t("enrollSuccess")}
                    </h3>
                    <p className="text-xs text-emerald-800">
                      {t("certificateIncluded")}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/verify/${certificate.id}`}
                  target="_blank"
                  className="px-4 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-bold rounded shadow-xs"
                >
                  Verify Certificate
                </Link>
              </div>

              <CertificateView certificate={certificate} showActions={true} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Exam Instructions Banner */}
              <div className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-lg p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#1B5E20] font-bold text-sm">
                  <Award className="w-5 h-5 text-[#C5A059]" />
                  <span>{t("certificateIncluded")}</span>
                </div>
                <p className="text-xs text-[#636E72] leading-relaxed">
                  Answer the following {examQuestions.length} questions assessing fundamental comprehension of the curriculum. A score of{" "}
                  <strong>{initialExam?.passing_percentage || 70}% or higher</strong> is required to earn the official Certificate under the seal of Sheikh Muhammed Ferej Megeno.
                </p>
                {!enrollment && (
                  <p className="text-xs text-amber-800 font-semibold pt-1">
                    {t("enroll")}
                  </p>
                )}
              </div>

              {examError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{examError}</span>
                </div>
              )}

              {/* Exam Failed Feedback */}
              {examResult && !examResult.passed && (
                <div className="p-5 bg-amber-50 border border-amber-300 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-amber-900">
                      Score: {examResult.score}% ({examResult.correct_count} of {examResult.total_questions} correct)
                    </h4>
                    <span className="text-xs font-bold text-amber-800">
                      Passing grade: {initialExam?.passing_percentage || 70}%
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    You did not reach the 70% threshold required for certification. Take time to review the audio lessons and texts, then retake the assessment when ready.
                  </p>
                  <button
                    onClick={() => {
                      setAnswers({});
                      setExamResult(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Assessment</span>
                  </button>
                </div>
              )}

              {/* Question Form */}
              <form onSubmit={handleSubmitExam} className="space-y-6">
                {examQuestions.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="bg-white border border-[#E0D8CE] rounded-lg p-5 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#E0D8CE] text-xs font-bold text-[#1B5E20] flex items-center justify-center shrink-0">
                        {qIndex + 1}
                      </span>
                      <h4 className="font-heading font-semibold text-sm text-[#2D3436] leading-relaxed">
                        {q.question}
                      </h4>
                    </div>

                    <div className="space-y-2 ps-8">
                      {q.options.map((option, optIndex) => {
                        const isSelected = answers[q.id] === optIndex;
                        return (
                          <label
                            key={optIndex}
                            className={`flex items-start gap-2.5 p-3 rounded border text-xs cursor-pointer transition-colors ${
                              isSelected
                                ? "border-[#1B5E20] bg-emerald-50/50 font-medium text-emerald-950"
                                : "border-[#E0D8CE] hover:border-[#C5A059] bg-[#FAF8F5]/60 text-[#2D3436]"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question_${q.id}`}
                              checked={isSelected}
                              onChange={() => handleSelectOption(q.id, optIndex)}
                              className="mt-0.5 text-[#1B5E20] focus:ring-[#1B5E20]"
                            />
                            <span className="leading-relaxed">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-[#636E72]">
                    {Object.keys(answers).length} of {examQuestions.length} answered
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmittingExam}
                    className="px-6 py-3 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmittingExam ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Grading...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit Assessment for Grading</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Enrollment Modal */}
      <CourseEnrollmentModal
        courseId={course.id}
        courseSlug={course.slug}
        courseTitle={course.title}
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onSuccess={(newEnr) => {
          setEnrollment(newEnr);
        }}
      />
    </div>
  );
}
