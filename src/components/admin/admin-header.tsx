"use client";

import { Menu, ExternalLink, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  username?: string;
}

export function AdminHeader({ onOpenMobileSidebar, username = "Admin" }: AdminHeaderProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <header className="h-16 bg-white border-b border-[#E0D8CE] px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-[#636E72] hover:text-[#2D3436] rounded hover:bg-[#FAF8F5]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs uppercase font-bold tracking-wider text-[#636E72]">
            System Online &bull; Live Dynamic Sync
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleRefresh}
          title="Refresh Data"
          className="p-2 text-[#636E72] hover:text-[#1B5E20] hover:bg-[#FAF8F5] rounded border border-transparent hover:border-[#E0D8CE] transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#1B5E20]" : ""}`} />
        </button>

        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#E0D8CE] text-xs font-semibold text-[#2D3436] hover:border-[#1B5E20] hover:text-[#1B5E20] bg-white transition-all shadow-2xs"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2 border-s border-[#E0D8CE] ps-3 ms-1">
          <div className="w-8 h-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-[#2D3436] hidden md:block">
            {username}
          </span>
        </div>
      </div>
    </header>
  );
}
