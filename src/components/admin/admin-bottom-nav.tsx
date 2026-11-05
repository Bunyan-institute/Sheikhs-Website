"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Video, MessageSquare, HelpCircle, Menu } from "lucide-react";

interface AdminBottomNavProps {
  onOpenMenu: () => void;
  pendingInquiriesCount?: number;
}

export function AdminBottomNav({ onOpenMenu, pendingInquiriesCount = 0 }: AdminBottomNavProps) {
  const pathname = usePathname();
  const t = useTranslations("admin.common");
  const tNav = useTranslations("nav");

  const items = [
    {
      label: t("dashboard"),
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: t("lectures"),
      href: "/admin/lectures",
      icon: Video,
      active: pathname.startsWith("/admin/lectures"),
    },
    {
      label: t("inquiries"),
      href: "/admin/inquiries",
      icon: MessageSquare,
      active: pathname.startsWith("/admin/inquiries"),
      badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : undefined,
    },
    {
      label: t("fatwas"),
      href: "/admin/fatwas",
      icon: HelpCircle,
      active: pathname.startsWith("/admin/fatwas"),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E0D8CE] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="h-14 grid grid-cols-5 items-center px-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                item.active
                  ? "text-[#1B5E20] font-bold"
                  : "text-[#636E72] hover:text-[#2D3436]"
              }`}
            >
              <div
                className={`relative p-1 rounded-full transition-colors ${
                  item.active ? "bg-emerald-50" : ""
                }`}
              >
                <Icon className={`w-5 h-5 ${item.active ? "text-[#1B5E20]" : "text-[#636E72]"}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-0.5 -end-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight truncate max-w-[56px] text-center mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More Menu Toggle */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 text-[#636E72] hover:text-[#2D3436] rounded-xl transition-all cursor-pointer"
          aria-label="Open full domain menu"
        >
          <div className="p-1 rounded-full">
            <Menu className="w-5 h-5 text-[#636E72]" />
          </div>
          <span className="text-[10px] leading-tight truncate max-w-[56px] text-center mt-0.5">
            {tNav("menu")}
          </span>
        </button>
      </div>
    </nav>
  );
}
