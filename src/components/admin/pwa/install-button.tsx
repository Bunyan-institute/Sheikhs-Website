"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/admin/ui/modal";
import { useStandalone } from "./use-standalone";
import { installPlatform } from "@/lib/pwa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
let cachedPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();
function updatePrompt(prompt: BeforeInstallPromptEvent | null) {
  cachedPrompt = prompt;
  listeners.forEach((listener) => listener(prompt));
}
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    updatePrompt(event as BeforeInstallPromptEvent);
  });
  window.addEventListener("appinstalled", () => updatePrompt(null));
}

export function InstallButton({ className = "", variant = "header" }: { className?: string; variant?: "header" | "sidebar" | "login" | "pill" | "menu" }) {
  const t = useTranslations("admin.common");
  const guideText = useTranslations("admin.install");
  const standalone = useStandalone();
  const [installed, setInstalled] = useState(false);
  const [prompt, setPrompt] = useState(cachedPrompt);
  const [guide, setGuide] = useState<"ios" | "android" | "desktop" | null>(null);
  useEffect(() => {
    listeners.add(setPrompt);
    const onInstalled = () => { setInstalled(true); setGuide(null); };
    window.addEventListener("appinstalled", onInstalled);
    return () => { listeners.delete(setPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);
  const install = async () => {
    if (prompt) {
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        updatePrompt(null); // A browser install prompt can be used only once.
        if (choice.outcome === "accepted") setInstalled(true);
        return;
      } catch { updatePrompt(null); }
    }
    setGuide(installPlatform(navigator));
  };
  if (standalone || installed) {
    return variant === "menu" || variant === "header" ? <span className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-adm-primary"><CheckCircle2 className="size-4" />{t("installed")}</span> : null;
  }
  const styles = variant === "sidebar"
    ? "w-full justify-start border border-emerald-600/40 text-emerald-200 hover:bg-emerald-900"
    : variant === "menu" ? "w-full justify-start text-adm-text hover:bg-adm-soft"
    : "border border-adm-primary bg-white text-adm-primary hover:bg-adm-soft";
  return (
    <>
      <button type="button" role={variant === "menu" ? "menuitem" : undefined} onClick={install} aria-label={t("installApp")}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${styles} ${className}`}>
        <Download className="size-4 shrink-0" />{t("installApp")}
      </button>
      {guide && createPortal(
        <Modal open onClose={() => setGuide(null)} title={guideText("title")} size="sm">
          <div className="space-y-5 text-base text-adm-text" data-install-guide={guide}>
            <p>{guideText(`${guide}Intro`)}</p>
            <ol className="list-decimal space-y-3 ps-5">
              {[1, 2, 3].map((step) => <li key={step}>{guideText(`${guide}Step${step}`)}</li>)}
            </ol>
            <p className="rounded-xl bg-adm-soft p-4 text-sm">{guideText("notificationsHint")}</p>
          </div>
        </Modal>, document.body
      )}
    </>
  );
}
