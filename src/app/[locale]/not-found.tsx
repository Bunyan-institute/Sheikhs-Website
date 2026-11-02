import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { BookOpen, Compass, Home, Search, Video } from "lucide-react";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");
  const tNav = useTranslations("nav");

  return (
    <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-20 md:py-28 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FAF8F5] border border-[#E0D8CE] text-[#1B5E20] mb-6 shadow-sm">
        <Compass className="w-10 h-10 stroke-[1.5]" />
      </div>

      <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#2D3436] tracking-tight mb-4">
        {t("title")}
      </h1>
      <p className="text-lg md:text-xl text-[#636E72] max-w-xl mx-auto font-body mb-10 leading-relaxed">
        {t("message")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10 text-left rtl:text-right">
        <Link
          href="/"
          className="p-5 rounded-md border border-[#E0D8CE] bg-white hover:border-[#1B5E20] hover:shadow-sm transition-all group"
        >
          <Home className="w-6 h-6 text-[#1B5E20] mb-3 group-hover:scale-110 transition-transform" />
          <div className="font-heading font-bold text-[#2D3436] group-hover:text-[#1B5E20]">{tNav("about")}</div>
          <div className="text-xs text-[#636E72] mt-1">{t("backHome")}</div>
        </Link>

        <Link
          href="/media"
          className="p-5 rounded-md border border-[#E0D8CE] bg-white hover:border-[#1B5E20] hover:shadow-sm transition-all group"
        >
          <Video className="w-6 h-6 text-[#1B5E20] mb-3 group-hover:scale-110 transition-transform" />
          <div className="font-heading font-bold text-[#2D3436] group-hover:text-[#1B5E20]">{tNav("media")}</div>
          <div className="text-xs text-[#636E72] mt-1">{tNav("lectures")}</div>
        </Link>

        <Link
          href="/courses"
          className="p-5 rounded-md border border-[#E0D8CE] bg-white hover:border-[#1B5E20] hover:shadow-sm transition-all group"
        >
          <BookOpen className="w-6 h-6 text-[#1B5E20] mb-3 group-hover:scale-110 transition-transform" />
          <div className="font-heading font-bold text-[#2D3436] group-hover:text-[#1B5E20]">{tNav("courses")}</div>
          <div className="text-xs text-[#636E72] mt-1">{tNav("knowledge")}</div>
        </Link>

        <Link
          href="/search"
          className="p-5 rounded-md border border-[#E0D8CE] bg-white hover:border-[#1B5E20] hover:shadow-sm transition-all group"
        >
          <Search className="w-6 h-6 text-[#1B5E20] mb-3 group-hover:scale-110 transition-transform" />
          <div className="font-heading font-bold text-[#2D3436] group-hover:text-[#1B5E20]">{tNav("search")}</div>
          <div className="text-xs text-[#636E72] mt-1">{tNav("more")}</div>
        </Link>
      </div>

      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 rounded bg-[#1B5E20] text-white font-semibold text-sm hover:bg-[#154a19] transition-colors shadow-sm"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
