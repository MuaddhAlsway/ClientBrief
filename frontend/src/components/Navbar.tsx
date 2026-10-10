import { Languages } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useI18n } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onStart?: () => void;
  variant?: 'transparent' | 'solid';
  showActions?: boolean;
}

export function Navbar({ onStart, variant = 'transparent', showActions = true }: NavbarProps) {
  const { t, toggleLocale } = useI18n();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-colors duration-300',
        variant === 'solid' ? 'border-b border-hair bg-base/85 backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <div className="shell flex h-20 items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3" aria-label="MU.LAB home">
          <BrandLogo priority />
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-faint md:inline">
            {t('nav.tagline')}
          </span>

          <button
            type="button"
            onClick={toggleLocale}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-hair px-3 text-[13px] text-mute transition-colors hover:border-faint hover:text-ink"
            aria-label="Switch language"
          >
            <Languages className="h-4 w-4" aria-hidden />
            <span>{t('nav.language')}</span>
          </button>

          {showActions && onStart ? (
            <button
              type="button"
              onClick={onStart}
              className="hidden h-10 items-center rounded-xl bg-ink px-4 text-[13px] font-medium text-base transition-colors hover:bg-mute sm:inline-flex"
            >
              {t('nav.start')}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
