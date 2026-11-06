"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, ExternalLink, RefreshCw, Globe, MoreVertical, LogOut, Bell } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { InstallButton } from "@/components/admin/pwa/install-button";
import { NotificationSettings } from "@/components/admin/pwa/notification-settings";
import { useStandalone } from "@/components/admin/pwa/use-standalone";
import { Dropdown, menuItemClass } from "@/components/admin/ui/dropdown";
import { useLogout } from "@/components/admin/use-logout";
import { locales, localeLabels, type Locale } from "@/i18n/config";

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  username?: string;
}

export function AdminHeader({ onOpenMobileSidebar, username = "Admin" }: AdminHeaderProps) {
  const router = useRouter();
  const tCommon = useTranslations("admin.common");
  const tHeader = useTranslations("admin.header");
  const tSidebar = useTranslations("admin.sidebar");
  const tNotifications = useTranslations("admin.notifications");
  const currentLocale = useLocale() as Locale;
  const standalone = useStandalone();
  const logout = useLogout();
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  const changeLanguage = (locale: Locale) => {
    document.cookie = `admin_locale=${locale};path=/;max-age=31536000;SameSite=Lax`;
    window.location.reload();
  };

  return (
    <>
    <header className="sticky top-0 z-30 box-content flex h-14 items-center justify-between gap-2 border-b border-adm-border bg-white/95 px-3 pt-[env(safe-area-inset-top)] backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="grid size-11 place-items-center rounded-lg text-adm-text hover:bg-adm-soft md:hidden"
          aria-label={tCommon("openMenu")}
        >
          <Menu className="size-6" />
        </button>
        <span className="truncate text-base font-bold text-adm-text md:hidden">{tCommon("appName")}</span>
        <span className="hidden items-center gap-2 md:flex">
          <span className="size-2.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-adm-muted">{tHeader("systemStatus")}</span>
        </span>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1">
        <Dropdown
          label={tCommon("switchLanguage")}
          width="w-48"
          trigger={
            <>
              <Globe className="size-5 text-adm-primary" />
              <span className="hidden text-sm sm:inline">{localeLabels[currentLocale]}</span>
              <span className="text-xs font-bold uppercase sm:hidden">{currentLocale}</span>
            </>
          }
        >
          {() =>
            locales.map((loc) => (
              <button
                key={loc}
                type="button"
                role="menuitemradio"
                aria-checked={currentLocale === loc}
                onClick={() => changeLanguage(loc)}
                className={`${menuItemClass} justify-between ${currentLocale === loc ? "bg-adm-soft font-bold text-adm-primary" : ""}`}
              >
                <span>{localeLabels[loc]}</span>
                {currentLocale === loc && <span className="size-2 rounded-full bg-adm-primary" />}
              </button>
            ))
          }
        </Dropdown>

        <Dropdown label={tCommon("moreActions")} trigger={<MoreVertical className="size-5" />}>
          {(close) => (
            <>
              <button type="button" role="menuitem" className={menuItemClass} onClick={() => { handleRefresh(); close(); }}>
                <RefreshCw className={`size-4 text-adm-primary ${refreshing ? "animate-spin" : ""}`} />
                {tHeader("refresh")}
              </button>
              <button type="button" role="menuitem" className={menuItemClass} onClick={() => { setNotificationsOpen(true); close(); }}>
                <Bell className="size-4 text-adm-primary" />
                {tNotifications("title")}
              </button>
              <InstallButton variant="menu" />
              {/* The installed app is admin-only: it never links out to the public site. */}
              {!standalone && (
                <Link href={`/${currentLocale}`} target="_blank" role="menuitem" className={menuItemClass} onClick={close}>
                  <ExternalLink className="size-4 text-adm-primary" />
                  {tHeader("liveSite")}
                </Link>
              )}
              <div className="my-1 border-t border-adm-border" />
              <button type="button" role="menuitem" className={`${menuItemClass} text-adm-danger`} onClick={logout}>
                <LogOut className="size-4" />
                {tSidebar("signOut")}
              </button>
            </>
          )}
        </Dropdown>

        <div
          title={username}
          className="ms-1 grid size-9 place-items-center rounded-full bg-adm-primary text-sm font-bold text-white"
          aria-label={username}
        >
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
    <NotificationSettings open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
}
