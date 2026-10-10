import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CardOption {
  value: string;
  label: string;
}

interface MultiSelectCardsProps {
  options: CardOption[];
  selected: string[];
  onToggle: (value: string) => void;
  legend?: string;
  columns?: 2 | 3;
}

export function MultiSelectCards({ options, selected, onToggle, legend, columns = 3 }: MultiSelectCardsProps) {
  return (
    <div
      role="group"
      aria-label={legend}
      className={cn('grid gap-3', columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3')}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <motion.button
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            onClick={() => onToggle(option.value)}
            whileTap={{ scale: 0.985 }}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl border px-4 py-3.5 text-start transition-colors duration-200',
              isSelected
                ? 'border-ink bg-hoverbg text-ink'
                : 'border-hair bg-card text-mute hover:border-faint hover:text-ink',
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 flex-none items-center justify-center rounded-md border transition-colors duration-200',
                isSelected ? 'border-ink bg-ink text-base' : 'border-hair group-hover:border-faint',
              )}
              aria-hidden
            >
              <motion.span
                initial={false}
                animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Check className="h-3.5 w-3.5" />
              </motion.span>
            </span>
            <span className="text-[14px] leading-snug tracking-tight">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
