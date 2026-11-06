"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, BellOff, Smartphone, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/admin/ui/modal";
import { useAdminFeedback } from "@/components/admin/ui/feedback";
import { buttonPrimary, buttonSecondary } from "@/components/admin/ui/form-field";
import { useStandalone } from "@/components/admin/pwa/use-standalone";

interface Device {
  id: string;
  endpoint: string;
  label: string;
  last_used_at: string | null;
}

type Support = "checking" | "unsupported" | "ios-install" | "ready";

function keyToBytes(base64Url: string): Uint8Array {
  const pad = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const raw = atob((base64Url + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

const sameKey = (a: ArrayBuffer | null | undefined, b: Uint8Array) => {
  if (!a || a.byteLength !== b.byteLength) return false;
  const x = new Uint8Array(a);
  return x.every((v, i) => v === b[i]);
};

/** Reaches the admin's service worker, but never waits forever when it is not registered. */
async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  const existing = await navigator.serviceWorker.getRegistration("/admin");
  if (existing?.active) return existing;
  return Promise.race([navigator.serviceWorker.ready, new Promise<null>((r) => setTimeout(() => r(null), 6000))]);
}

export function NotificationSettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("admin.notifications");
  const tCommon = useTranslations("admin.common");
  const { toast } = useAdminFeedback();
  const standalone = useStandalone();

  const [support, setSupport] = useState<Support>("checking");
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [serverReady, setServerReady] = useState<boolean | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [busy, setBusy] = useState(false);

  const loadDevices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/push/devices");
      if (res.ok) setDevices((await res.json()).devices ?? []);
    } catch {
      // list is informational
    }
  }, []);

  /** Reads the real state of this device and repairs a subscription made with older server keys. */
  const refresh = useCallback(async () => {
    const hasApis = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (!hasApis) return setSupport(ios && !standalone ? "ios-install" : "unsupported");
    setSupport("ready");
    setPermission(Notification.permission);

    let key: string | null = null;
    try {
      const info = await (await fetch("/api/admin/push/subscribe")).json();
      setServerReady(Boolean(info.enabled));
      key = info.publicKey ?? null;
      setPublicKey(key);
    } catch {
      setServerReady(false);
    }

    const reg = await getRegistration();
    let sub = reg ? await reg.pushManager.getSubscription() : null;
    if (reg && sub && key && !sameKey(sub.options.applicationServerKey, keyToBytes(key))) {
      // The server's keys changed since this device subscribed: start over with the new key.
      await sub.unsubscribe();
      sub = Notification.permission === "granted" ? await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(key) as BufferSource }) : null;
      if (sub) await fetch("/api/admin/push/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ subscription: sub.toJSON() }) });
    }
    setEndpoint(sub?.endpoint ?? null);
    loadDevices();
  }, [standalone, loadDevices]);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  const enable = async () => {
    if (!publicKey) return;
    setBusy(true);
    try {
      // Must run straight from the tap: browsers (and iPhones) refuse permission prompts that are not user-initiated.
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") return;
      const reg = await getRegistration();
      if (!reg) throw new Error("no service worker");
      const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(publicKey) as BufferSource }));
      const res = await fetch("/api/admin/push/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ subscription: sub.toJSON() }) });
      if (!res.ok) {
        await sub.unsubscribe();
        throw new Error("server refused the subscription");
      }
      setEndpoint(sub.endpoint);
      toast.success(t("enabledToast"));
      loadDevices();
    } catch {
      toast.error(t("failed"));
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      const reg = await getRegistration();
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      if (sub) {
        await fetch("/api/admin/push/subscribe", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) });
        await sub.unsubscribe();
      }
      setEndpoint(null);
      toast.success(t("disabledToast"));
      loadDevices();
    } finally {
      setBusy(false);
    }
  };

  const sendTest = async () => {
    setBusy(true);
    try {
      await fetch("/api/admin/push/test", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ endpoint }) });
      toast.info(t("testSent"));
    } finally {
      setBusy(false);
    }
  };

  const removeDevice = async (d: Device) => {
    await fetch(`/api/admin/push/devices?id=${encodeURIComponent(d.id)}`, { method: "DELETE" });
    if (d.endpoint === endpoint) await disable();
    else loadDevices();
  };

  const note = (text: string, tone: "warn" | "info" = "info") => (
    <p className={`rounded-xl px-4 py-3 text-sm ${tone === "warn" ? "bg-adm-warn-soft text-adm-text" : "bg-adm-soft text-adm-text"}`}>{text}</p>
  );

  return (
    <Modal open={open} onClose={onClose} title={t("title")} size="md">
      <div className="space-y-5">
        <p className="text-sm text-adm-muted">{t("intro")}</p>

        {support === "unsupported" && note(t("unsupported"), "warn")}
        {support === "ios-install" && note(t("iosInstallFirst"), "warn")}
        {support === "ready" && serverReady === false && note(t("notConfigured"), "warn")}
        {support === "ready" && permission === "denied" && note(t("denied"), "warn")}

        {support === "ready" && serverReady && permission !== "denied" && (
          <div className="space-y-3">
            <p className="flex items-center gap-2 font-semibold text-adm-text" data-notification-status={endpoint ? "on" : "off"}>
              {endpoint ? <Bell className="size-5 text-adm-primary" /> : <BellOff className="size-5 text-adm-muted" />}
              {endpoint ? t("statusOn") : t("statusOff")}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {endpoint ? (
                <>
                  <button type="button" className={buttonPrimary} onClick={sendTest} disabled={busy}>
                    {t("sendTest")}
                  </button>
                  <button type="button" className={buttonSecondary} onClick={disable} disabled={busy}>
                    {t("disable")}
                  </button>
                </>
              ) : (
                <button type="button" className={buttonPrimary} onClick={enable} disabled={busy}>
                  <Bell className="size-5" />
                  {t("enable")}
                </button>
              )}
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-adm-muted">{t("devices")}</h3>
          {devices.length === 0 ? (
            <p className="text-sm text-adm-muted">{t("noDevices")}</p>
          ) : (
            <ul className="divide-y divide-adm-border overflow-hidden rounded-xl border border-adm-border">
              {devices.map((d) => (
                <li key={d.id} className="flex items-center gap-3 px-3 py-2.5">
                  <Smartphone className="size-5 shrink-0 text-adm-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-adm-text">
                      {d.label} {d.endpoint === endpoint && <span className="ms-1 rounded-full bg-adm-soft px-2 py-0.5 text-xs text-adm-primary">{t("thisDevice")}</span>}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeDevice(d)} aria-label={`${t("remove")}: ${d.label}`} className="grid size-11 place-items-center rounded-lg text-adm-danger hover:bg-adm-danger-soft">
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="button" className={buttonSecondary} onClick={onClose}>
          {tCommon("close")}
        </button>
      </div>
    </Modal>
  );
}
