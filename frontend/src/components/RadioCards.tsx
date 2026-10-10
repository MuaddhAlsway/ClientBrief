import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CardOption } from './MultiSelectCards';

interface RadioCardsProps {
  options: CardOption[];
  value?: string;
  onChange: (value: string) => void;
  legend?: string;
  columns?: 2 | 3;
  name: string;
}

export function RadioCards({ options, value, onChange, legend, columns = 3, name }: RadioCardsProps) {
  return (
    <div
      role="radiogroup"
      aria-label={legend}
      className={cn('grid gap-3', columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3')}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            name={name}
            onClick={() => onChange(option.value)}
            whileTap={{ scale: 0.985 }}
            className={cn(
              'group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-start transition-colors duration-200',
              isSelected
                ? 'border-ink bg-hoverbg text-ink'
                : 'border-hair bg-card text-mute hover:border-faint hover:text-ink',
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 flex-none items-center justify-center rounded-full border transition-colors duration-200',
                isSelected ? 'border-ink' : 'border-hair group-hover:border-faint',
              )}
              aria-hidden
            >
              <motion.span
                className="h-2.5 w-2.5 rounded-full bg-ink"
                initial={false}
                animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            <span className="text-[14px] leading-snug tracking-tight">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
