import { Link } from '@/i18n/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex items-center space-x-2 text-xs font-sans text-[#0F241C]/60 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="hover:text-[#1B6A50] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-[#0F241C] font-semibold' : ''}>
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span className="mx-2 text-[#BF9A45]/50">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}