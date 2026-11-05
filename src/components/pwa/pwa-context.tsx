"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface PwaContextType {
  canInstall: boolean;
  isInstalled: boolean;
  isIos: boolean;
  isAndroid: boolean;
  isIosGuideOpen: boolean;
  promptInstall: () => Promise<boolean>;
  openIosGuide: () => void;
  closeIosGuide: () => void;
}

const PwaContext = createContext<PwaContextType>({
  canInstall: false,
  isInstalled: false,
  isIos: false,
  isAndroid: false,
  isIosGuideOpen: false,
  promptInstall: async () => false,
  openIosGuide: () => {},
  closeIosGuide: () => {},
});

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIosGuideOpen, setIsIosGuideOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://");

    setIsInstalled(isStandalone);

    // Detect platform
    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua);
    const androidDevice = /android/.test(ua);
    setIsIos(iosDevice);
    setIsAndroid(androidDevice);

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          // If there's an update found, handle lifecycle
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New update available
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("Service worker registration failed:", err);
        });
    }

    // Capture install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsIosGuideOpen(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        if (choice.outcome === "accepted") {
          setIsInstalled(true);
          return true;
        }
      } catch (err) {
        console.error("Installation prompt error:", err);
      }
      return false;
    }

    // On iOS, open the guide
    if (isIos && !isInstalled) {
      setIsIosGuideOpen(true);
      return false;
    }

    return false;
  }, [deferredPrompt, isIos, isInstalled]);

  const openIosGuide = useCallback(() => setIsIosGuideOpen(true), []);
  const closeIosGuide = useCallback(() => setIsIosGuideOpen(false), []);

  const canInstall = !isInstalled && (Boolean(deferredPrompt) || isIos || isAndroid);

  return (
    <PwaContext.Provider
      value={{
        canInstall,
        isInstalled,
        isIos,
        isAndroid,
        isIosGuideOpen,
        promptInstall,
        openIosGuide,
        closeIosGuide,
      }}
    >
      {children}
      {isIosGuideOpen && <IosInstallModal onClose={closeIosGuide} />}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  return useContext(PwaContext);
}

function IosInstallModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Install Sheikh Muhammed Ferej App on iOS"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#072118] text-[#EDF4F0] border border-[#BF9A45]/40 rounded-3xl p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#BF9A45]/20">
          <div className="flex items-center gap-3">
            <img
              src="/icons/icon-192.png"
              alt="Sheikh Muhammed Ferej App"
              className="w-10 h-10 rounded-xl border border-[#BF9A45]/50"
            />
            <div>
              <h3 className="font-bold text-sm text-[#EDF4F0]">Install Sheikh Ferej App</h3>
              <p className="text-[11px] text-[#BF9A45]">Direct iOS Standalone App</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#EDF4F0]/90">
          <p className="leading-relaxed">
            Install this platform directly to your home screen as a standalone application without requiring the App Store:
          </p>

          <div className="bg-[#0D3E2F]/80 border border-[#BF9A45]/30 rounded-2xl p-3 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#BF9A45] text-[#072118] font-bold text-[11px] shrink-0">
                1
              </span>
              <span>
                Tap the <strong className="text-[#E6D3A3]">Share</strong> button in Safari's bottom toolbar (the square icon with an arrow pointing up).
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#BF9A45] text-[#072118] font-bold text-[11px] shrink-0">
                2
              </span>
              <span>
                Scroll down and select <strong className="text-[#E6D3A3]">Add to Home Screen</strong>.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#BF9A45] text-[#072118] font-bold text-[11px] shrink-0">
                3
              </span>
              <span>
                Tap <strong className="text-[#E6D3A3]">Add</strong> in the top right. The app will launch in full standalone mode with no browser URL bars.
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-[#BF9A45] text-[#072118] font-bold text-xs hover:bg-[#E6D3A3] transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
