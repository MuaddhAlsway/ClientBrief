import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { Hero } from '@/features/client-intake/Hero';
import { useI18n } from '@/i18n/LanguageContext';
import type { Locale } from '@/types/brief';

interface LandingProps {
  onStart: () => void;
  privacyUrl?: string;
}

const CAPABILITIES: Record<Locale, string[]> = {
  en: [
    'Strategy & Discovery',
    'UI / UX Design',
    'Web Engineering',
    'E-Commerce',
    'Web Applications',
    'SaaS Platforms',
    'Arabic & Bilingual',
    'Performance & SEO',
    'Design Systems',
  ],
  ar: [
    'الاستراتيجية والاكتشاف',
    'تصميم واجهات وتجربة',
    'هندسة الويب',
    'التجارة الإلكترونية',
    'تطبيقات الويب',
    'منصات SaaS',
    'العربية وتعدد اللغات',
    'الأداء وتحسين محركات البحث',
    'أنظمة التصميم',
  ],
};

export function Landing({ onStart, privacyUrl }: LandingProps) {
  const { t, locale } = useI18n();
  const reduce = useReducedMotion();
  const capabilities = CAPABILITIES[locale];
  const process = [
    { title: t('landing.p1.title'), body: t('landing.p1.body') },
    { title: t('landing.p2.title'), body: t('landing.p2.body') },
    { title: t('landing.p3.title'), body: t('landing.p3.body') },
  ];

  return (
    <div className="relative">
      <Navbar onStart={onStart} />

      <main>
        <Hero onStart={onStart} />

        <section className="overflow-hidden border-y border-hair py-5">
          <div className="flex w-max gap-10" aria-hidden>
            <motion.div
              className="flex gap-10"
              animate={reduce ? undefined : { x: ['0%', '-50%'] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            >
              {[...capabilities, ...capabilities].map((item, index) => (
                <span key={`${item}-${index}`} className="flex items-center gap-10 font-mono text-[12px] uppercase tracking-[0.2em] text-faint">
                  {item}
                  <span className="h-1 w-1 rounded-full bg-hair" />
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="shell py-24 sm:py-32">
          <Reveal className="max-w-2xl">
            <p className="eyebrow mb-4">{t('landing.approach.eyebrow')}</p>
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-medium leading-[1.1] tracking-tight text-ink">
              {t('landing.approach.title')}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-mute">{t('landing.approach.body')}</p>
          </Reveal>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-hair bg-hair sm:grid-cols-3">
            {process.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08} className="bg-card">
                <div className="flex h-full flex-col gap-4 p-7">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-faint">0{index + 1}</span>
                  <h3 className="text-[22px] font-medium tracking-tight text-ink">{item.title}</h3>
                  <p className="text-[13.5px] leading-relaxed text-mute">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="shell pb-24 sm:pb-32">
          <Reveal>
            <p className="eyebrow mb-4">{t('landing.capabilities.eyebrow')}</p>
            <h2 className="max-w-2xl text-[clamp(1.8rem,4vw,3rem)] font-medium leading-[1.1] tracking-tight text-ink">
              {t('landing.capabilities.title')}
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-0 sm:grid-cols-2">
            {capabilities.map((item, index) => (
              <Reveal key={item} delay={(index % 2) * 0.05}>
                <div className="flex items-baseline gap-4 border-t border-hair py-5">
                  <span className="font-mono text-[11px] text-faint">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-[16px] tracking-tight text-ink">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="shell pb-24 sm:pb-32">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-hair bg-card px-7 py-16 text-center sm:px-16">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 h-64 w-[520px] -translate-x-1/2 rounded-full bg-ink/[0.05] blur-[100px]"
              />
              <h2 className="relative text-[clamp(1.8rem,4.5vw,3.2rem)] font-medium leading-[1.08] tracking-tight text-ink">
                {t('landing.cta.title')}
              </h2>
              <p className="relative mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-mute">
                {t('landing.cta.body')}
              </p>
              <button
                type="button"
                onClick={onStart}
                className="group relative mt-9 inline-flex h-14 items-center gap-3 rounded-xl bg-ink px-7 text-[13px] font-semibold uppercase tracking-[0.16em] text-base transition-colors duration-300 hover:bg-mute"
              >
                {t('hero.cta')}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  aria-hidden
                />
              </button>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer privacyUrl={privacyUrl} />
    </div>
  );
}
