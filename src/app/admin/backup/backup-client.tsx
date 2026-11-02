"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  Upload,
  RefreshCw,
  Database,
  CheckCircle,
  AlertTriangle,
  Copy,
  Check,
  FileCode,
  Loader2,
  HardDrive,
} from "lucide-react";
import { restoreDatabaseAction, resetDatabaseAction } from "../actions";

interface SystemMetrics {
  lecturesCount: number;
  videoLectures: number;
  audioLessons: number;
  seriesCount: number;
  articlesCount: number;
  fatwasCount: number;
  coursesCount: number;
  booksCount: number;
  eventsCount: number;
  mediaCount: number;
  inquiriesTotal: number;
  pendingInquiries: number;
  lastUpdated: string;
  version: number;
}

export function BackupClient({
  initialJson,
  metrics,
}: {
  initialJson: string;
  metrics: SystemMetrics;
}) {
  const t = useTranslations("admin.backup");
  const tCommon = useTranslations("admin.common");

  const [jsonContent, setJsonContent] = useState(initialJson);
  const [restoreInput, setRestoreInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const handleDownloadBackup = () => {
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `sheikh-ferej-portal-backup-${dateStr}-v${metrics.version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setFeedback({
      type: "success",
      message: t("exportDesc"),
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRestoreInput(content);
      setFeedback({
        type: "success",
        message: `${file.name} - ${t("restoreDesc")}`,
      });
    };
    reader.readAsText(file);
  };

  const handleRestore = async () => {
    if (!restoreInput.trim()) {
      alert(t("selectFile"));
      return;
    }

    if (
      !confirm(
        t("restoreDesc")
      )
    ) {
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await restoreDatabaseAction(restoreInput.trim());
      if (res.success) {
        setFeedback({
          type: "success",
          message: `${tCommon("success")}: v${res.version}`,
        });
        setJsonContent(restoreInput.trim());
      } else {
        setFeedback({
          type: "error",
          message: res.error || tCommon("error"),
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || tCommon("error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    const confirmed = prompt(
      'Type "RESET" to confirm restore to seed data:'
    );
    if (confirmed !== "RESET") return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await resetDatabaseAction();
      if (res.success) {
        setFeedback({
          type: "success",
          message: tCommon("success"),
        });
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || tCommon("error"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3436]">
            {t("heading")}
          </h1>
          <p className="text-xs text-[#636E72] mt-0.5">
            {t("subheading")}
          </p>
        </div>

        <button
          onClick={handleDownloadBackup}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{t("exportJson")}</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 border text-xs rounded-md flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="hover:opacity-75 font-semibold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Database State Card */}
      <div className="bg-white border border-[#E0D8CE] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-[#1B5E20]/10 flex items-center justify-center text-[#1B5E20]">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-[#2D3436]">
                {t("storageUsage")}
              </h2>
              <p className="text-[11px] text-[#636E72]">
                v{metrics.version} • {t("lastBackup")}: {new Date(metrics.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-[#FBF9F5] p-3 rounded border border-[#F0EAE1] text-center">
            <div className="font-heading text-lg font-bold text-[#1B5E20]">{metrics.lecturesCount}</div>
            <div className="text-[11px] text-[#636E72]">{tCommon("lectures")}</div>
          </div>
          <div className="bg-[#FBF9F5] p-3 rounded border border-[#F0EAE1] text-center">
            <div className="font-heading text-lg font-bold text-[#1B5E20]">{metrics.seriesCount}</div>
            <div className="text-[11px] text-[#636E72]">{tCommon("series")}</div>
          </div>
          <div className="bg-[#FBF9F5] p-3 rounded border border-[#F0EAE1] text-center">
            <div className="font-heading text-lg font-bold text-[#1B5E20]">{metrics.articlesCount}</div>
            <div className="text-[11px] text-[#636E72]">{tCommon("articles")}</div>
          </div>
          <div className="bg-[#FBF9F5] p-3 rounded border border-[#F0EAE1] text-center">
            <div className="font-heading text-lg font-bold text-[#1B5E20]">{metrics.fatwasCount}</div>
            <div className="text-[11px] text-[#636E72]">{tCommon("fatwas")}</div>
          </div>
          <div className="bg-[#FBF9F5] p-3 rounded border border-[#F0EAE1] text-center">
            <div className="font-heading text-lg font-bold text-[#1B5E20]">{metrics.booksCount}</div>
            <div className="text-[11px] text-[#636E72]">{tCommon("library")}</div>
          </div>
          <div className="bg-[#FBF9F5] p-3 rounded border border-[#F0EAE1] text-center">
            <div className="font-heading text-lg font-bold text-[#1B5E20]">{metrics.inquiriesTotal}</div>
            <div className="text-[11px] text-[#636E72]">{tCommon("inquiries")}</div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Backup JSON & Restore Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Current Active JSON */}
        <div className="bg-white border border-[#E0D8CE] rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#1B5E20]" />
              <h3 className="font-heading font-bold text-sm text-[#2D3436]">
                {t("exportJson")}
              </h3>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs text-[#1B5E20] hover:text-[#154a19] font-medium cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Raw JSON"}</span>
            </button>
          </div>

          <textarea
            readOnly
            value={jsonContent}
            rows={14}
            className="w-full text-[11px] font-mono p-3 bg-[#FBF9F5] border border-[#E0D8CE] rounded focus:outline-none text-[#2D3436] resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#636E72]">
              Size: {(new TextEncoder().encode(jsonContent).length / 1024).toFixed(1)} KB
            </span>
            <button
              onClick={handleDownloadBackup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#E0D8CE] hover:border-[#1B5E20] text-xs font-medium text-[#2D3436] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#1B5E20]" />
              <span>{t("downloadBackup")}</span>
            </button>
          </div>
        </div>

        {/* Right: Restore from JSON */}
        <div className="bg-white border border-[#E0D8CE] rounded-lg p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-heading font-bold text-sm text-[#2D3436]">
                  {t("restoreBackup")}
                </h3>
              </div>
              <label className="inline-flex items-center gap-1 text-xs text-[#1B5E20] hover:underline cursor-pointer">
                <span>{t("selectFile")}</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-xs text-[#636E72]">
              {t("restoreDesc")}
            </p>

            <textarea
              value={restoreInput}
              onChange={(e) => setRestoreInput(e.target.value)}
              placeholder="Paste valid backup JSON here..."
              rows={12}
              className="w-full text-[11px] font-mono p-3 bg-white border border-[#E0D8CE] rounded focus:outline-none focus:border-[#1B5E20] text-[#2D3436] resize-none"
            />
          </div>

          <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between gap-3">
            <button
              onClick={handleRestore}
              disabled={isLoading || !restoreInput.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-[4px] bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{t("restoreButton")}</span>
            </button>

            <button
              onClick={handleReset}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
              title="Reset to default seed data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
