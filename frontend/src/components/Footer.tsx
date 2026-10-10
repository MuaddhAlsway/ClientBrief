import { BrandLogo } from './BrandLogo';
import { useI18n } from '@/i18n/LanguageContext';

interface FooterProps {
  privacyUrl?: string;
}

export function Footer({ privacyUrl = '/privacy.html' }: FooterProps) {
  const { t } = useI18n();

  return (
    <footer className="mt-24 border-t border-hair">
      <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <BrandLogo className="h-8" />
          <p className="max-w-xs text-[13px] leading-relaxed text-faint">{t('footer.tagline')}</p>
        </div>

        <div className="flex flex-col gap-2 text-[13px] text-faint sm:items-end">
          <a href={privacyUrl} className="transition-colors hover:text-ink">
            {t('footer.privacy')}
          </a>
          <span>{t('footer.rights', { year: new Date().getFullYear() })}</span>
        </div>
      </div>
    </footer>
  );
}
