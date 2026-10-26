"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  Layers,
  FileText,
  HelpCircle,
  GraduationCap,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  User,
  Database,
  ExternalLink,
  LogOut,
  X,
  Users,
  Award,
} from "lucide-react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
  pendingInquiriesCount?: number;
}

export function AdminSidebar({ onCloseMobile, pendingInquiriesCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Lectures & Videos", href: "/admin/lectures", icon: Video },
    { label: "Series & Curriculum", href: "/admin/series", icon: Layers },
    { label: "Articles & Hadith", href: "/admin/articles", icon: FileText },
    { label: "Fatwas & Rulings", href: "/admin/fatwas", icon: HelpCircle },
    { label: "Courses & Programs", href: "/admin/courses", icon: GraduationCap },
    { label: "Student Enrollments", href: "/admin/enrollments", icon: Users },
    { label: "Issued Certificates", href: "/admin/certificates", icon: Award },
    { label: "Kitabs & Documents", href: "/admin/library", icon: BookOpen },
    { label: "Events & Khutbahs", href: "/admin/events", icon: Calendar },
    { label: "Media Gallery", href: "/admin/media", icon: ImageIcon },
    {
      label: "Public Inquiries",
      href: "/admin/inquiries",
      icon: MessageSquare,
      badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : undefined,
    },
    { label: "Scholar Profile", href: "/admin/profile", icon: User },
    { label: "Backup & Restore", href: "/admin/backup", icon: Database },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch {
      window.location.href = "/admin/login";
    }
  };

  return (
    <aside className="w-64 bg-[#2D3436] text-white flex flex-col h-full shrink-0 border-e border-[#3e4446]">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#3e4446]">
        <Link href="/admin" className="flex items-center gap-3 group">
          <span className="w-8 h-8 rounded bg-[#1B5E20] text-white flex items-center justify-center font-bold text-base shadow border border-[#2e7d32]">
            م
          </span>
          <div className="min-w-0">
            <span className="font-heading font-bold text-sm block truncate group-hover:text-emerald-400 transition-colors">
              Sheikh Muhammed Ferej
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#B8860B] font-semibold block">
              Control Panel
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
          Knowledge Domains
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#1B5E20] text-white shadow-xs font-semibold"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#B8860B] text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#3e4446] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>View Public Portal</span>
          </span>
          <span className="text-[10px] text-gray-400">Live ↗</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-start"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
