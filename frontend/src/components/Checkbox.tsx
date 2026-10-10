import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, error, id, ...props }, ref) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className={cn(
          'flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors duration-200',
          error ? 'border-danger/60' : 'border-hair hover:border-faint',
        )}
      >
        <input
          ref={ref}
          id={fieldId}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            'mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md border text-transparent transition-colors duration-200',
            'border-hair peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-base',
            'peer-checked:border-ink peer-checked:bg-ink peer-checked:text-base',
          )}
          aria-hidden
        >
          <Check className="h-3.5 w-3.5" />
        </span>
        <span className="text-[13.5px] leading-relaxed text-mute">{label}</span>
      </label>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 px-1 text-[12.5px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export function AnimatedCheckbox(props: CheckboxProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Checkbox {...props} />
    </motion.div>
  );
}
