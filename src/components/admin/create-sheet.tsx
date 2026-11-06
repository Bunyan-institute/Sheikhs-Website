"use client";

import Link from "next/link";
import { Video, FileText, Image as ImageIcon, Calendar, BookOpen, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/admin/ui/modal";

export const createTargets = [
  { key: "createLecture", href: "/admin/lectures?new=1", icon: Video },
  { key: "createArticle", href: "/admin/articles?new=1", icon: FileText },
  { key: "createMedia", href: "/admin/media?new=1", icon: ImageIcon },
  { key: "createEvent", href: "/admin/events?new=1", icon: Calendar },
  { key: "createBook", href: "/admin/library?new=1", icon: BookOpen },
  { key: "createFatwa", href: "/admin/fatwas?new=1", icon: HelpCircle },
] as const;

/** The "+" sheet: big, friendly choices for what to add. Each opens that page's create form. */
export function CreateSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("admin.common");
  return (
    <Modal open={open} onClose={onClose} title={t("createWhat")} size="sm">
      <div className="grid grid-cols-2 gap-3">
        {createTargets.map(({ key, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            onClick={onClose}
            className="flex min-h-28 flex-col items-center justify-center gap-2.5 rounded-2xl border border-adm-border bg-adm-bg p-3 text-center text-sm font-bold text-adm-text active:bg-adm-soft hover:border-adm-primary"
          >
            <span className="grid size-12 place-items-center rounded-full bg-white text-adm-primary shadow-sm">
              <Icon className="size-6" />
            </span>
            {t(key)}
          </Link>
        ))}
      </div>
    </Modal>
  );
}
