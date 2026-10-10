import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BUDGET_OPTIONS } from '@/i18n/options';
import { useI18n } from '@/i18n/LanguageContext';

interface BudgetSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  options: readonly string[];
}

export function BudgetSelector({ value, onChange, options }: BudgetSelectorProps) {
  const { option } = useI18n();

  return (
    <div role="radiogroup" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((item) => {
        const isSelected = value === item;
        const [amount] = item.split(' SAR');
        const isRange = item !== "Let's discuss";
        return (
          <motion.button
            key={item}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(item)}
            whileTap={{ scale: 0.985 }}
            className={cn(
              'flex flex-col items-start gap-1 rounded-xl border px-5 py-4 text-start transition-colors duration-200',
              isSelected
                ? 'border-ink bg-hoverbg'
                : 'border-hair bg-card hover:border-faint',
            )}
          >
            <span className={cn('font-display text-[19px] tracking-tight', isSelected ? 'text-ink' : 'text-mute')}>
              {isRange ? amount : option('budget', item)}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              {isRange ? 'SAR' : 'MU.LAB'}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export { BUDGET_OPTIONS };
