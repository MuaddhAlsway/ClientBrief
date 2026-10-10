import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { useI18n } from '@/i18n/LanguageContext';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: reduce ? 0 : 0.2 },
    },
  };

  const line = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hair to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/[0.04] blur-[120px]"
      />

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <motion.div variants={line}>
          <BrandLogo priority className="h-12 sm:h-14" />
        </motion.div>

        <motion.p variants={line} className="eyebrow mt-10">
          {t('hero.eyebrow')}
        </motion.p>

        <h1 className="mt-6 text-[clamp(2.4rem,7vw,5.2rem)] font-medium leading-[1.02] tracking-tightest text-ink">
          <motion.span variants={line} className="block">
            {t('hero.titleLine1')}
          </motion.span>
          <motion.span variants={line} className="block text-mute">
            {t('hero.titleLine2')}
          </motion.span>
        </h1>

        <motion.p variants={line} className="mt-8 max-w-xl text-[clamp(0.95rem,1.6vw,1.1rem)] leading-relaxed text-mute">
          {t('hero.description')}
        </motion.p>

        <motion.div variants={line} className="mt-11 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onStart}
            className="group inline-flex h-14 items-center gap-3 rounded-xl bg-ink px-7 text-[13px] font-semibold uppercase tracking-[0.16em] text-base transition-colors duration-300 hover:bg-mute"
          >
            {t('hero.cta')}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              aria-hidden
            />
          </button>
          <span className="font-mono text-[11px] tracking-[0.16em] text-faint">{t('hero.eta')}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
