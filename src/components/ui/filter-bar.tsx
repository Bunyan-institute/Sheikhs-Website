"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { PublicCategory } from "@/lib/api/types";

interface FilterBarProps {
  categories: PublicCategory[];
  currentCategory?: string;
}

export function FilterBar({ categories, currentCategory }: FilterBarProps) {
  const t = useTranslations("lectures");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryClick = (slug: string) => {
    if (currentCategory === slug) {
      router.push(`${pathname}?${createQueryString("category", "")}`);
    } else {
      router.push(`${pathname}?${createQueryString("category", slug)}`);
    }
  };

  return (
    <div className="flex w-full items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
      <button
        onClick={() => router.push(`${pathname}?${createQueryString("category", "")}`)}
        className={cn(
          "whitespace-nowrap rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all border cursor-pointer min-h-[38px]",
          !currentCategory
            ? "bg-[#0D3E2F] text-white border-[#0D3E2F] shadow-xs"
            : "bg-white text-[#0F241C] border-[#072118]/15 hover:border-[#1B6A50] hover:text-[#1B6A50]"
        )}
      >
        {t("all")}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.slug)}
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all border cursor-pointer min-h-[38px]",
            currentCategory === category.slug
              ? "bg-[#0D3E2F] text-white border-[#0D3E2F] shadow-xs"
              : "bg-white text-[#0F241C] border-[#072118]/15 hover:border-[#1B6A50] hover:text-[#1B6A50]"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
