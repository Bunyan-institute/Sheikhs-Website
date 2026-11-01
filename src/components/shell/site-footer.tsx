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
    { href: "/lectures", labelKey: "nav.lectures" },
    { href: "/series", labelKey: "nav.series" },
    { href: "/articles", labelKey: "nav.articles" },
    { href: "/fatwas", labelKey: "nav.fatwas" },
    { href: "/courses", labelKey: "nav.courses" },
  ];

  const libraryLinks = [
    { href: "/library", labelKey: "nav.library" },
    { href: "/events", labelKey: "nav.events" },
    { href: "/verify", labelKey: "nav.verify" },
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
    <footer className="w-full bg-[#FAF8F5] border-t border-[#E6E0D8] mt-auto">
      {/* Sacred Knowledge Hadith Colophon Banner */}
      <div className="border-b border-[#E6E0D8] bg-[#F2ECE1]/60 py-6 px-4">
        <div className="max-w-[1560px] mx-auto text-center space-y-2">
          <p className="font-arabic text-[#1A4D2E] text-base sm:text-lg font-bold" dir="rtl">
            « مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ »
          </p>
          <p className="text-xs text-[#7A8285] font-serif italic">
            &ldquo;Whoever treads a path seeking knowledge, Allah makes easy for him a path to Paradise.&rdquo; — Sahih Muslim
          </p>
        </div>
      </div>

      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Scholar Name & Info */}
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col space-y-4">
            <Link href="/" className="font-heading text-xl font-bold text-[#2D3436] hover:text-[#1A4D2E] transition-colors break-words">
              {profile.name}
            </Link>
            {profile.headline && (
              <p className="font-body text-sm text-[#555E61] max-w-sm leading-relaxed">
                {profile.headline}
              </p>
            )}
            <div className="pt-2 text-xs text-[#7A8285] space-y-1 font-medium">
              <p>• Sharia Consultant, Wegagen Bank (Amanah)</p>
              <p>• Member, African Scholars Union</p>
              <p>• President, Al-Fajr Islamic Foundation</p>
            </div>
            {/* Google Play App Download CTA */}
            <div className="pt-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-[3px] bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#143d24] transition-colors"
              >
                <svg className="w-4 h-4 text-[#B8860B]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186c-.33-.2-.533-.564-.533-.969V2.783c0-.405.203-.769.532-.969zm11.597 11.598l2.38 2.38-12.062 6.845 9.682-9.225zm0-2.824L5.524 1.363l12.062 6.845-2.38 2.38zm1.414 1.412l3.473 1.968c.84.476.84 1.258 0 1.734l-3.473 1.968-2.121-2.121 2.121-2.121z"/>
                </svg>
                <span>Get &ldquo;ሸይኽ ሙሃመድ ፈረጅ&rdquo; App</span>
              </a>
            </div>

            {/* Socials */}
            <div className="pt-2 flex flex-wrap gap-2.5">
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
                    className="p-2 rounded-[3px] bg-white border border-[#E6E0D8] text-[#555E61] hover:text-[#1A4D2E] hover:border-[#1A4D2E]"
                    aria-label={`Official ${key}`}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Profile & Journey */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-heading text-xs font-bold text-[#1A4D2E] uppercase tracking-wider">
              Scholar
            </h3>
            <nav className="flex flex-col space-y-2">
              {profileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-[#555E61] hover:text-[#1A4D2E] w-fit"
                >
                  {t(link.labelKey as any)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Knowledge & Curriculum */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-heading text-xs font-bold text-[#1A4D2E] uppercase tracking-wider">
              {t("nav.knowledge" as any)}
            </h3>
            <nav className="flex flex-col space-y-2">
              {knowledgeLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-[#555E61] hover:text-[#1A4D2E] w-fit"
                >
                  {t(link.labelKey as any)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Library & Engagement */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-heading text-xs font-bold text-[#1A4D2E] uppercase tracking-wider">
              Library &amp; Treatises
            </h3>
            <nav className="flex flex-col space-y-2">
              {libraryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-[#555E61] hover:text-[#1A4D2E] w-fit"
                >
                  {t(link.labelKey as any)}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E6E0D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <p className="font-body text-xs text-[#7A8285]">
            © {currentYear} {profile.name}. All educational materials published for beneficial knowledge.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6 text-xs text-[#7A8285]">
            <Link href="/about" className="hover:text-[#1A4D2E]">Biography</Link>
            <Link href="/library" className="hover:text-[#1A4D2E]">Scholarly Treatises</Link>
            <a href="https://play.google.com/store/apps/details?id=com.sheikhmuhammedferej" target="_blank" rel="noopener noreferrer" className="hover:text-[#1A4D2E] font-bold text-[#1A4D2E]">ሸይኽ ሙሃመድ ፈረጅ App</a>
            <Link href="/contact" className="hover:text-[#1A4D2E]">Direct Inquiry</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
