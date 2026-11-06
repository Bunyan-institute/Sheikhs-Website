"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, CheckCircle2, Smartphone, X, MonitorDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

// Global cached prompt event so any button in header/sidebar/login can trigger it
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(e: BeforeInstallPromptEvent | null) => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    promptListeners.forEach((fn) => fn(globalDeferredPrompt));
  });

  window.addEventListener("appinstalled", () => {
    globalDeferredPrompt = null;
    promptListeners.forEach((fn) => fn(null));
  });
}

interface InstallButtonProps {
  className?: string;
  variant?: "header" | "sidebar" | "login" | "pill" | "menu";
}

export function InstallButton({ className = "", variant = "header" }: InstallButtonProps) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showBrowserGuide, setShowBrowserGuide] = useState(false);

  let t = (key: string) => key;
  try {
    const tCommon = useTranslations("admin.common");
    t = tCommon;
  } catch {
    // fallback if outside NextIntl context
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect standalone PWA mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    setIsIos(ios);

    const onPromptUpdate = (e: BeforeInstallPromptEvent | null) => {
      setDeferred(e);
    };
    promptListeners.add(onPromptUpdate);

    return () => {
      promptListeners.delete(onPromptUpdate);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferred) {
      try {
        await deferred.prompt();
        const choice = await deferred.userChoice;
        if (choice.outcome === "accepted") {
          setIsStandalone(true);
          setDeferred(null);
          globalDeferredPrompt = null;
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      }
      return;
    }

    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    // If on desktop Chrome/Edge without auto-prompt event, show instructions to click the address bar install icon
    setShowBrowserGuide(true);
  }, [deferred, isIos]);

  if (isStandalone) {
    if (variant === "menu") {
      return (
        <div className="flex min-h-11 items-center gap-3 px-4 py-2.5 text-sm text-adm-primary">
          <CheckCircle2 className="size-4" />
          {t("installed")}
        </div>
      );
    }
    if (variant === "header") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">{t("installed")}</span>
        </span>
      );
    }
    return null;
  }

  const label = t("installApp");

  if (variant === "menu") {
    return (
      <>
        <button type="button" role="menuitem" onClick={handleInstall} className="flex min-h-11 w-full items-center gap-3 px-4 py-2.5 text-start text-sm text-adm-text hover:bg-adm-soft">
          <Download className="size-4 text-adm-primary" />
          {label}
        </button>
        {renderModals()}
      </>
    );
  }

  if (variant === "sidebar") {
    return (
      <>
        <button
          type="button"
          onClick={handleInstall}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-emerald-300 hover:text-white hover:bg-[#1B5E20] transition-colors cursor-pointer border border-[#1B5E20]/50 ${className}`}
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>{label}</span>
        </button>
        {renderModals()}
      </>
    );
  }

  if (variant === "login") {
    return (
      <>
        <button
          type="button"
          onClick={handleInstall}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#1B5E20] text-[#1B5E20] hover:bg-emerald-50 text-xs font-bold transition-all shadow-2xs cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-[#1B5E20]" />
          <span>{label}</span>
        </button>
        {renderModals()}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1B5E20] text-white text-xs font-bold hover:bg-[#144718] transition-all shadow-xs cursor-pointer ${className}`}
        title="Download Sheikh Admin as a real standalone app"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{label}</span>
      </button>
      {renderModals()}
    </>
  );

  function renderModals() {
    return (
      <>
        {showIosGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setShowIosGuide(false)}
          >
            <div
              className="w-full max-w-sm bg-white text-[#2D3436] rounded-2xl p-6 shadow-2xl border border-gray-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1B5E20] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    م
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Install Sheikh Admin</h3>
                    <p className="text-[11px] text-[#B8860B] font-semibold">Standalone iPhone/iPad App</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIosGuide(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-700">
                <p className="leading-relaxed">
                  Install the Admin Control Center directly onto your iPhone or iPad for fast, dedicated access:
                </p>

                <div className="bg-[#FAF8F5] border border-gray-200 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1B5E20] text-white font-bold text-[11px] shrink-0">
                      1
                    </span>
                    <span>
                      Tap the <strong>Share</strong> button at the bottom of Safari (the square icon with an arrow pointing up).
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1B5E20] text-white font-bold text-[11px] shrink-0">
                      2
                    </span>
                    <span>
                      Scroll down and select <strong>Add to Home Screen</strong>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1B5E20] text-white font-bold text-[11px] shrink-0">
                      3
                    </span>
                    <span>
                      Tap <strong>Add</strong> in the top-right corner. The app will launch in standalone mode with its own icon.
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIosGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#1B5E20] text-white font-bold text-xs hover:bg-[#144718] transition-colors"
              >
                Got it / ገባኝ
              </button>
            </div>
          </div>
        )}

        {showBrowserGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setShowBrowserGuide(false)}
          >
            <div
              className="w-full max-w-sm bg-white text-[#2D3436] rounded-2xl p-6 shadow-2xl border border-gray-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <MonitorDown className="w-6 h-6 text-[#1B5E20]" />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Download Sheikh Admin</h3>
                    <p className="text-[11px] text-[#B8860B] font-semibold">Desktop / Browser App</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBrowserGuide(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-700">
                <p className="leading-relaxed">
                  To download and install Sheikh Admin as a real standalone application:
                </p>

                <div className="bg-[#FAF8F5] border border-gray-200 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1B5E20] text-white font-bold text-[11px] shrink-0">
                      1
                    </span>
                    <span>
                      Look at your browser's address bar on the right side and click the <strong>Install App icon (computer with down arrow)</strong>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1B5E20] text-white font-bold text-[11px] shrink-0">
                      2
                    </span>
                    <span>
                      Alternatively, click your browser menu (<strong>⋮</strong> or <strong>⋯</strong>) and select <strong>&quot;Install Sheikh Admin...&quot;</strong> or <strong>&quot;Cast, save and share &gt; Install page as app&quot;</strong>.
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowBrowserGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#1B5E20] text-white font-bold text-xs hover:bg-[#144718] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
}
