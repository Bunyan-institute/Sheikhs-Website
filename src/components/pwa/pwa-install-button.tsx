"use client";

import React from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { usePwa } from "./pwa-context";

interface PwaInstallButtonProps {
  className?: string;
  variant?: "badge" | "button" | "minimal";
  label?: string;
}

export function PwaInstallButton({
  className = "",
  variant = "button",
  label,
}: PwaInstallButtonProps) {
  const { canInstall, isInstalled, promptInstall, isIos, openIosGuide } = usePwa();

  if (isInstalled) {
    if (variant === "minimal") return null;
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B6A50]/20 text-[#A3E6CD] text-xs font-semibold border border-[#1B6A50]/40">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#1D6A5A]" />
        <span>App Installed</span>
      </span>
    );
  }

  if (!canInstall) return null;

  const handleClick = async () => {
    if (isIos) {
      openIosGuide();
    } else {
      await promptInstall();
    }
  };

  const buttonText = label || (isIos ? "Install App" : "Download App");

  if (variant === "badge") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#BF9A45]/20 hover:bg-[#BF9A45]/30 text-[#E6D3A3] text-xs font-semibold border border-[#BF9A45]/40 transition-colors cursor-pointer ${className}`}
        aria-label="Install Sheikh Muhammed Ferej App"
      >
        <Download className="w-3 h-3 text-[#BF9A45]" />
        <span>{buttonText}</span>
      </button>
    );
  }

  if (variant === "minimal") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`p-2 rounded-lg text-[#EDF4F0] hover:text-[#E6D3A3] hover:bg-white/10 transition-colors cursor-pointer ${className}`}
        aria-label="Install Sheikh Muhammed Ferej App"
        title={buttonText}
      >
        <Download className="w-4 h-4 text-[#BF9A45]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#BF9A45] hover:bg-[#E6D3A3] text-[#072118] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${className}`}
      aria-label="Install Sheikh Muhammed Ferej App"
    >
      <Download className="w-3.5 h-3.5 text-[#072118]" />
      <span>{buttonText}</span>
    </button>
  );
}
