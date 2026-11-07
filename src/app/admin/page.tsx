import Link from "next/link";
import { createTranslator } from "next-intl";
import { Video, FileText, Image as ImageIcon, CheckCircle2, MessageSquare, ArrowRight, Users, Calendar, GraduationCap } from "lucide-react";
import { getSystemMetrics, getAllInquiries, getAllEventRegistrations, getAllCourseEnrollments } from "@/lib/db/repository";
import { getAdminLocale } from "@/lib/admin-locale";
import { getAdminMessages } from "@/lib/admin-messages";

export default async function AdminDashboardPage() {
  const locale = await getAdminLocale();
  const messages = getAdminMessages(locale);
  const tDash = createTranslator({ locale, messages, namespace: "admin.dashboard" });
  const tCommon = createTranslator({ locale, messages, namespace: "admin.common" });

  const metrics = await getSystemMetrics();
  const inquiries = (await getAllInquiries()).filter((i) => i.status === "pending").slice(0, 3);
  const registrations = await getAllEventRegistrations();
  const enrollments = await getAllCourseEnrollments();

  const signups = [
    ...registrations.map((r) => ({
      id: r.id,
      at: r.created_at,
      text: tDash("signupEvent", { name: r.name, title: r.event_title }),
      icon: Calendar,
    })),
    ...enrollments.map((e) => ({
      id: e.id,
      at: e.created_at,
      text: tDash("signupCourse", { name: e.student_name, title: e.course_title }),
      icon: GraduationCap,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 4);

  const create = [
    { href: "/admin/lectures?new=1", label: tCommon("createLecture"), icon: Video },
    { href: "/admin/articles?new=1", label: tCommon("createArticle"), icon: FileText },
    { href: "/admin/media?new=1", label: tCommon("createMedia"), icon: ImageIcon },
  ];

  const counts = [
    { href: "/admin/lectures", label: tCommon("lectures"), value: metrics.lecturesCount },
    { href: "/admin/articles", label: tCommon("articles"), value: metrics.articlesCount },
    { href: "/admin/fatwas", label: tCommon("fatwas"), value: metrics.fatwasCount },
    { href: "/admin/courses", label: tCommon("courses"), value: metrics.coursesCount },
  ];

  const pending = metrics.pendingInquiries;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-2xl bg-lapis p-5 text-white sm:p-7">
        <p className="font-arabic text-lg text-leaf" dir="rtl" lang="ar">
          بسم الله الرحمن الرحيم
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{tDash("greeting")}</h1>
      </section>

      <section aria-labelledby="attention">
        <h2 id="attention" className="mb-2.5 text-sm font-bold uppercase tracking-wide text-adm-muted">
          {tDash("needsAttention")}
        </h2>
        {pending > 0 ? (
          <div className="rounded-2xl border border-adm-accent/50 bg-adm-warn-soft p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-3 text-base font-bold text-adm-text">
                <span className="grid size-11 place-items-center rounded-full bg-white text-adm-accent">
                  <MessageSquare className="size-5" />
                </span>
                {tDash("pendingQuestions", { count: pending })}
              </p>
              <Link href="/admin/inquiries" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-adm-primary px-5 text-sm font-bold text-white hover:bg-adm-primary-hover">
                {tDash("answerNow")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </div>
            {inquiries.length > 0 && (
              <ul className="mt-4 space-y-2">
                {inquiries.map((q) => (
                  <li key={q.id} className="line-clamp-2 rounded-xl bg-white/80 px-4 py-2.5 text-sm text-adm-text">
                    {q.question}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="flex items-center gap-3 rounded-2xl border border-adm-border bg-white p-4 text-base font-semibold text-adm-primary">
            <CheckCircle2 className="size-6" />
            {tDash("allCaughtUp")}
          </p>
        )}
      </section>

      <section aria-labelledby="quick-add">
        <h2 id="quick-add" className="mb-2.5 text-sm font-bold uppercase tracking-wide text-adm-muted">
          {tDash("quickAdd")}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {create.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-adm-border bg-white p-3 text-center text-sm font-bold text-adm-text hover:border-adm-primary active:bg-adm-soft"
            >
              <span className="grid size-12 place-items-center rounded-full bg-adm-soft text-adm-primary">
                <Icon className="size-6" />
              </span>
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="signups">
        <h2 id="signups" className="mb-2.5 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-adm-muted">
          <Users className="size-4" />
          {tDash("recentSignups")}
        </h2>
        {signups.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-adm-border bg-white/60 p-5 text-center text-sm text-adm-muted">{tDash("noSignups")}</p>
        ) : (
          <ul className="divide-y divide-adm-border overflow-hidden rounded-2xl border border-adm-border bg-white">
            {signups.map(({ id, text, at, icon: Icon }) => (
              <li key={id} className="flex items-center gap-3 px-4 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-adm-soft text-adm-primary">
                  <Icon className="size-4" />
                </span>
                <p className="min-w-0 flex-1 text-sm text-adm-text">{text}</p>
                <time className="shrink-0 text-xs text-adm-muted" dateTime={at}>
                  {new Date(at).toLocaleDateString(locale)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="content">
        <h2 id="content" className="mb-2.5 text-sm font-bold uppercase tracking-wide text-adm-muted">
          {tDash("yourContent")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {counts.map((c) => (
            <Link key={c.href} href={c.href} className="rounded-2xl border border-adm-border bg-white p-4 hover:border-adm-primary">
              <p className="text-3xl font-bold text-adm-primary">{c.value}</p>
              <p className="mt-0.5 truncate text-sm text-adm-muted">{c.label}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
