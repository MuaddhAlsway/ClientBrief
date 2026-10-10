import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/LanguageContext';

interface ProgressIndicatorProps {
  labels: string[];
  current: number;
  onStepClick?: (index: number) => void;
}

export function ProgressIndicator({ labels, current, onStepClick }: ProgressIndicatorProps) {
  const { t } = useI18n();
  const total = labels.length;
  const percent = Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full" aria-label={t('common.stepOf', { current: current + 1, total })}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
          {t('common.stepOf', { current: current + 1, total })}
        </span>
        <span className="font-mono text-[11px] tracking-[0.18em] text-mute">{percent}%</span>
      </div>

      <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-hair">
        <motion.div
          className="absolute inset-y-0 start-0 rounded-full bg-ink"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <ol className="mt-4 hidden items-center gap-1 md:flex" role="list">
        {labels.map((label, index) => {
          const state = index < current ? 'done' : index === current ? 'active' : 'upcoming';
          const clickable = onStepClick && index < current;
          return (
            <li key={label} className="flex flex-1 items-center gap-1">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(index)}
                aria-current={state === 'active' ? 'step' : undefined}
                className={cn(
                  'group flex items-center gap-2 whitespace-nowrap rounded-lg px-1 py-1 text-left transition-colors',
                  clickable ? 'cursor-pointer hover:text-ink' : 'cursor-default',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[10px] font-medium transition-colors',
                    state === 'done' && 'border-ink bg-ink text-base',
                    state === 'active' && 'border-ink text-ink',
                    state === 'upcoming' && 'border-hair text-faint',
                  )}
                >
                  {state === 'done' ? <Check className="h-3 w-3" aria-hidden /> : index + 1}
                </span>
                <span
                  className={cn(
                    'text-[12px] tracking-tight transition-colors',
                    state === 'active' ? 'text-ink' : 'text-faint group-hover:text-mute',
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
