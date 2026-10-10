import { motion } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Button } from './ui/button';
import { useI18n } from '@/i18n/LanguageContext';

interface SuccessScreenProps {
  referenceId: string;
  email: string;
  submittedAt?: string;
  onReturnHome: () => void;
}

export function SuccessScreen({ referenceId, email, submittedAt, onReturnHome }: SuccessScreenProps) {
  const { t, locale } = useI18n();

  const time = submittedAt
    ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(submittedAt))
    : '';

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-[100dvh] flex-col items-center justify-center px-5 py-20 text-center"
    >
      <BrandLogo className="mb-12 h-9" />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative mb-10 flex h-20 w-20 items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full border border-hair" />
        <motion.span
          className="absolute inset-0 rounded-full border border-ink/40"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.35, opacity: 0 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-base">
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Check className="h-7 w-7" strokeWidth={3} aria-hidden />
          </motion.span>
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.08] tracking-tight text-ink"
      >
        {t('success.title')}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 max-w-lg text-[15px] leading-relaxed text-mute"
      >
        {t('success.desc')}
      </motion.p>

      <motion.dl
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.54, ease: [0.22, 1, 0.36, 1] }}
        className="mt-12 w-full max-w-md rounded-2xl border border-hair bg-card text-start"
      >
        <div className="border-b border-hair px-5 py-4">
          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">{t('success.reference')}</dt>
          <dd className="mt-1 font-mono text-[15px] text-ink">{referenceId}</dd>
        </div>
        <div className="border-b border-hair px-5 py-4">
          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">{t('success.email')}</dt>
          <dd className="mt-1 text-[14px] text-ink">{email}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">{t('success.confirmed')}</dt>
            {time ? <dd className="mt-1 text-[13px] text-mute">{t('success.receivedAt', { time })}</dd> : null}
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-hair text-ink">
            <Check className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </motion.dl>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.64, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        <Button variant="secondary" size="lg" onClick={onReturnHome} className="group">
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1"
            aria-hidden
          />
          {t('success.home')}
        </Button>
        <p className="text-[12.5px] text-faint">{t('success.followUp')}</p>
      </motion.div>
    </motion.main>
  );
}
