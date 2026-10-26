import type { SectionMap } from "./api/types";

export interface NavItem {
  key: string;
  href: string;
  labelKey: string;
  children?: NavItem[];
}

export const DEFAULT_SECTIONS: SectionMap = {
  lectures: true,
  articles: true,
  fatwas: true,
  courses: true,
  library: true,
  events: true,
  questions: true,
};

export function buildNavigation(sections?: Partial<SectionMap> | null): NavItem[] {
  const s = { ...DEFAULT_SECTIONS, ...(sections || {}) };

  const nav: NavItem[] = [
    { key: "about", href: "/about", labelKey: "nav.about" },
  ];

  if (s.lectures) {
    nav.push({ key: "lectures", href: "/lectures", labelKey: "nav.lectures" });
  }

  const knowledge: NavItem[] = [];
  if (s.articles) {
    knowledge.push({ key: "articles", href: "/articles", labelKey: "nav.articles" });
  }
  if (s.fatwas) {
    knowledge.push({ key: "fatwas", href: "/fatwas", labelKey: "nav.fatwas" });
  }
  if (s.courses) {
    knowledge.push({ key: "courses", href: "/courses", labelKey: "nav.courses" });
  }
  if (s.lectures) {
    knowledge.push({ key: "series", href: "/series", labelKey: "nav.series" });
  }

  if (knowledge.length > 0) {
    nav.push({
      key: "knowledge",
      href: "#",
      labelKey: "nav.knowledge",
      children: knowledge,
    });
  }

  if (s.library) {
    nav.push({ key: "library", href: "/library", labelKey: "nav.library" });
  }

  if (s.events) {
    nav.push({ key: "events", href: "/events", labelKey: "nav.events" });
  }

  const more = buildMoreItems(sections);
  if (more.length > 0) {
    nav.push({
      key: "more",
      href: "#",
      labelKey: "nav.more",
      children: more,
    });
  }

  return nav;
}

export function buildMoreItems(sections?: Partial<SectionMap> | null): NavItem[] {
  const s = { ...DEFAULT_SECTIONS, ...(sections || {}) };

  const items: NavItem[] = [
    { key: "journey", href: "/journey", labelKey: "nav.journey" },
    { key: "qualifications", href: "/qualifications", labelKey: "nav.qualifications" },
    { key: "verify", href: "/verify", labelKey: "nav.verify" },
    { key: "media", href: "/media", labelKey: "nav.media" },
  ];

  if (s.questions) {
    items.push({ key: "ask", href: "/ask", labelKey: "nav.ask" });
  }

  items.push({ key: "contact", href: "/contact", labelKey: "nav.contact" });

  return items;
}
