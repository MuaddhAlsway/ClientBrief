import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type TranslationKey } from './translations';
import { translateOption } from './options';
import type { Locale } from '@/types/brief';

interface I18nValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  option: (group: string, value: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = 'mulab.locale';

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'ar' || stored === 'en') return stored;
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, dir]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const toggleLocale = useCallback(() => setLocaleState((current) => (current === 'en' ? 'ar' : 'en')), []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const table = translations[locale] as Record<string, string>;
      let value = table[key] ?? (translations.en as Record<string, string>)[key] ?? key;
      if (vars) {
        for (const [name, replacement] of Object.entries(vars)) {
          value = value.replace(new RegExp(`\\{${name}\\}`, 'g'), String(replacement));
        }
      }
      return value;
    },
    [locale],
  );

  const option = useCallback((group: string, value: string) => translateOption(group, value, locale), [locale]);

  const value = useMemo<I18nValue>(
    () => ({ locale, dir, setLocale, toggleLocale, t, option }),
    [locale, dir, setLocale, toggleLocale, t, option],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within LanguageProvider');
  return context;
}
