"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Video, MessageSquare, Menu, Plus } from "lucide-react";

interface AdminBottomNavProps {
  onOpenMenu: () => void;
  onOpenCreate: () => void;
  pendingInquiriesCount?: number;
}

/** Phone dock: four destinations around a raised "+" that opens the create sheet. */
export function AdminBottomNav({ onOpenMenu, onOpenCreate, pendingInquiriesCount = 0 }: AdminBottomNavProps) {
  const pathname = usePathname();
  const t = useTranslations("admin.common");
  const tNav = useTranslations("nav");

  const link = (href: string, label: string, Icon: typeof Video, active: boolean, badge?: number) => (
    <Link
      key={href}
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative flex flex-col items-center justify-center gap-0.5 py-1.5 ${active ? "font-bold text-adm-primary" : "text-adm-muted"}`}
    >
      <span className={`relative grid h-7 w-12 place-items-center rounded-full ${active ? "bg-adm-soft" : ""}`}>
        <Icon className="size-5" />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 end-0.5 grid min-w-4 place-items-center rounded-full bg-adm-danger px-1 text-[10px] font-bold leading-4 text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span className="max-w-full truncate px-1 text-[11px] leading-tight">{label}</span>
    </Link>
  );

  return (
    <nav
      aria-label={t("mainNavigation")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-adm-border bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(15,36,28,0.08)] md:hidden"
    >
      <div className="grid h-16 grid-cols-5 items-end">
        {link("/admin", t("dockHome"), LayoutDashboard, pathname === "/admin")}
        {link("/admin/inquiries", t("dockQuestions"), MessageSquare, pathname.startsWith("/admin/inquiries"), pendingInquiriesCount)}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onOpenCreate}
            aria-label={t("create")}
            className="-mt-5 grid size-14 place-items-center rounded-full bg-adm-primary text-white shadow-lg ring-4 ring-adm-bg active:scale-95"
          >
            <Plus className="size-7" />
          </button>
        </div>

        {link("/admin/lectures", t("dockLessons"), Video, pathname.startsWith("/admin/lectures"))}

        <button type="button" onClick={onOpenMenu} className="flex flex-col items-center justify-center gap-0.5 py-1.5 text-adm-muted">
          <span className="grid h-7 w-12 place-items-center rounded-full">
            <Menu className="size-5" />
          </span>
          <span className="max-w-full truncate px-1 text-[11px] leading-tight">{tNav("menu")}</span>
        </button>
      </div>
    </nav>
  );
}
