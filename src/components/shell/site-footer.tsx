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
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'twitter':
      case 'x':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'telegram':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const knowledgeLinks = [
    { href: "/media", labelKey: "nav.media" },
    { href: "/series", labelKey: "nav.series" },
    { href: "/articles", labelKey: "nav.articles" },
    { href: "/fatwas", labelKey: "nav.fatwas" },
    { href: "/courses", labelKey: "nav.courses" },
  ];

  const resourceLinks = [
    { href: "/events", labelKey: "nav.events" },
    { href: "/verify", labelKey: "nav.verify" },
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
    <footer className="relative bg-[#072118] text-[#EDF4F0]/80 overflow-hidden mt-auto border-t border-[#BF9A45]/20">
      <div className="absolute inset-0 lattice opacity-30 pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto max-w-page px-4 sm:px-6 pt-14 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 sm:gap-10">
          <div>
            <p className="font-arabic text-2xl sm:text-3xl text-[#E6D3A3]" dir="rtl" lang="ar">الشيخ محمد فرج مجنو</p>
            <p className="mt-2 font-display text-lg sm:text-xl text-[#EDF4F0]">Sheikh Muhammed Ferej Megeno</p>
            <p className="mt-2 text-sm leading-relaxed max-w-xs text-[#EDF4F0]/75">
              Islamic scholar, educator and Sharia consultant. President of the Al-Fajr Islamic Foundation and member of the African Scholars Union.
            </p>
            
            <div className="mt-5">
              <a
                href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0D3E2F] border border-[#BF9A45]/40 hover:border-[#BF9A45] text-[#EDF4F0] text-xs font-semibold hover:bg-[#1B6A50]/40 transition-all shadow-sm"
              >
                <svg className="w-4 h-4 text-[#BF9A45]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186c-.33-.2-.533-.564-.533-.969V2.783c0-.405.203-.769.532-.969zm11.597 11.598l2.38 2.38-12.062 6.845 9.682-9.225zm0-2.824L5.524 1.363l12.062 6.845-2.38 2.38zm1.414 1.412l3.473 1.968c.84.476.84 1.258 0 1.734l-3.473 1.968-2.121-2.121 2.121-2.121z"/>
                </svg>
                <span>Get &ldquo;ሸይኽ ሙሃመድ ፈረጅ&rdquo; App</span>
              </a>
            </div>

            {/* Socials */}
            <div className="mt-5 flex flex-wrap gap-2.5">
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
                    className="p-2 rounded-lg bg-[#0D3E2F] border border-[#BF9A45]/30 text-[#EDF4F0]/80 hover:text-[#E6D3A3] hover:border-[#BF9A45] transition-colors"
                    aria-label={`Official ${key}`}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Scholar">
            <p className="font-display text-[#EDF4F0] text-lg font-semibold">Scholar</p>
            <ul className="mt-3.5 space-y-2 text-sm">
              {profileLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#E6D3A3] transition-colors inline-block py-0.5">
                    {t(link.labelKey as any)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Knowledge">
            <p className="font-display text-[#EDF4F0] text-lg font-semibold">Knowledge</p>
            <ul className="mt-3.5 space-y-2 text-sm">
              {knowledgeLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#E6D3A3] transition-colors inline-block py-0.5">
                    {t(link.labelKey as any)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <p className="font-display text-[#EDF4F0] text-lg font-semibold">Resources</p>
            <ul className="mt-3.5 space-y-2 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#E6D3A3] transition-colors inline-block py-0.5">
                    {t(link.labelKey as any)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 sm:mt-14 pt-6 border-t border-[#EDF4F0]/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#EDF4F0]/60 text-center sm:text-start">
          <p>© {currentYear} Sheikh Muhammed Ferej Megeno. All educational materials are published for beneficial knowledge.</p>
          <p className="font-arabic text-sm text-[#E6D3A3]" dir="rtl" lang="ar">وَقُل رَّبِّ زِدْنِي عِلْمًا</p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
