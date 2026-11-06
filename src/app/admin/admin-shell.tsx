"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminBottomNav } from "@/components/admin/admin-bottom-nav";
import { AdminFeedbackProvider } from "@/components/admin/ui/feedback";
import { CreateSheet } from "@/components/admin/create-sheet";
import { localeDirections, type Locale } from "@/i18n/config";

interface AdminShellProps {
  children: React.ReactNode;
  username: string;
  pendingInquiriesCount?: number;
  locale?: Locale;
}

export function AdminShell({
  children,
  username,
  pendingInquiriesCount = 0,
  locale = "en",
}: AdminShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const dir = localeDirections[locale] ?? "ltr";

  // Show the number of unanswered questions on the installed app's icon where the platform supports it.
  useEffect(() => {
    const nav = navigator as Navigator & { setAppBadge?: (n?: number) => Promise<void>; clearAppBadge?: () => Promise<void> };
    if (pendingInquiriesCount > 0) nav.setAppBadge?.(pendingInquiriesCount).catch(() => {});
    else nav.clearAppBadge?.().catch(() => {});
  }, [pendingInquiriesCount]);

  return (
    <AdminFeedbackProvider>
    <div dir={dir} lang={locale} className="flex min-h-screen bg-adm-bg">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar pendingInquiriesCount={pendingInquiriesCount} />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10">
            <AdminSidebar
              onCloseMobile={() => setMobileSidebarOpen(false)}
              pendingInquiriesCount={pendingInquiriesCount}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-dvh overflow-y-auto">
        <AdminHeader
          username={username}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-[max(6rem,calc(5.5rem+env(safe-area-inset-bottom)))] md:pb-[max(1rem,env(safe-area-inset-bottom))] max-w-[1600px] w-full mx-auto">
          {children}
        </main>
        <AdminBottomNav
          onOpenMenu={() => setMobileSidebarOpen(true)}
          onOpenCreate={() => setCreateOpen(true)}
          pendingInquiriesCount={pendingInquiriesCount}
        />
      </div>
      <CreateSheet open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
    </AdminFeedbackProvider>
  );
}
