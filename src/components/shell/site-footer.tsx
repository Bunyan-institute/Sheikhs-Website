import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { PublicProfile } from '@/lib/api/types';
import { buildNavigation, type NavItem } from '@/lib/sections';

export interface SiteFooterProps {
  profile: PublicProfile;
  navItems?: NavItem[];
  locale?: string;
}

export function SiteFooter({ profile, navItems, locale = 'en' }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const t = useTranslations();
  const items = navItems || buildNavigation(profile.sections);

  const renderSocialIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'youtube':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'twitter':
      case 'x':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'telegram':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 0010.86 4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.54z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const knowledgeLinks = [
    { href: "/lectures", labelKey: "nav.lectures" },
    { href: "/series", labelKey: "nav.series" },
    { href: "/articles", labelKey: "nav.articles" },
    { href: "/fatwas", labelKey: "nav.fatwas" },
    { href: "/courses", labelKey: "nav.courses" },
  ];

  const libraryLinks = [
    { href: "/library", labelKey: "nav.library" },
    { href: "/events", labelKey: "nav.events" },
    { href: "/media", labelKey: "nav.media" },
    { href: "/ask", labelKey: "nav.ask" },
    { href: "/search", labelKey: "nav.search" },
  ];

  const profileLinks = [
    { href: "/about", labelKey: "nav.about" },
    { href: "/journey", labelKey: "nav.journey" },
    { href: "/qualifications", labelKey: "nav.qualifications" },
    { href: "/contact", labelKey: "nav.contact" },
  ];

  return (
    <footer className="w-full bg-[#F4F1EB] border-t border-[#E0D8CE] mt-auto">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Scholar Name & Info */}
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col space-y-4">
            <Link href="/" className="font-heading text-xl font-bold text-[#2D3436] hover:text-[#1B5E20] transition-colors break-words">
              {profile.name}
            </Link>
            {profile.headline && (
              <p className="font-body text-sm text-[#636E72] max-w-sm leading-relaxed">
                {profile.headline}
              </p>
            )}
            <div className="pt-2 text-xs text-[#636E72] space-y-1">
              <p>• Sharia Consultant, Wegagen Bank</p>
              <p>• Member, African Scholars Union</p>
              <p>• President, Al-Fajr Islamic Foundation</p>
            </div>
            {/* Socials */}
            <div className="pt-2 flex flex-wrap gap-3">
              {profile.socials && Object.entries(profile.socials).map(([key, url]) => {
                if (!url) return null;
                const icon = renderSocialIcon(key);
                if (!icon) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white border border-[#E0D8CE] text-[#636E72] hover:text-[#1B5E20] hover:border-[#1B5E20] transition-colors"
                    aria-label={`Visit our ${key}`}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Profile & Journey */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-heading text-xs font-bold text-[#2D3436] uppercase tracking-wider">
              Scholar
            </h3>
            <nav className="flex flex-col space-y-2">
              {profileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-[#636E72] hover:text-[#1B5E20] transition-colors w-fit"
                >
                  {t(link.labelKey as any)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Knowledge & Curriculum */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-heading text-xs font-bold text-[#2D3436] uppercase tracking-wider">
              {t("nav.knowledge" as any)}
            </h3>
            <nav className="flex flex-col space-y-2">
              {knowledgeLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-[#636E72] hover:text-[#1B5E20] transition-colors w-fit"
                >
                  {t(link.labelKey as any)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Library & Engagement */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-heading text-xs font-bold text-[#2D3436] uppercase tracking-wider">
              Resources
            </h3>
            <nav className="flex flex-col space-y-2">
              {libraryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-[#636E72] hover:text-[#1B5E20] transition-colors w-fit"
                >
                  {t(link.labelKey as any)}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E0D8CE] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <p className="font-body text-xs text-[#636E72]">
            © {currentYear} {profile.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6 text-xs text-[#636E72]">
            <Link href="/about" className="hover:text-[#1B5E20] transition-colors">Biography</Link>
            <Link href="/library/kitab-at-tawheed" className="hover:text-[#1B5E20] transition-colors">Kitab At-Tawheed</Link>
            <Link href="/contact" className="hover:text-[#1B5E20] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
