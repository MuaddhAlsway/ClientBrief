import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label: string;
  error?: string;
  optional?: string;
  containerClassName?: string;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, optional, id, containerClassName, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const errorId = `${fieldId}-error`;

    return (
      <div className={cn('w-full', containerClassName)}>
        <label htmlFor={fieldId} className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-mute">
          {label}
          {optional ? <span className="ms-1.5 lowercase tracking-normal text-faint">({optional})</span> : null}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            type="date"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'h-14 w-full rounded-xl border bg-elevated px-4 pe-11 text-[15px] text-ink outline-none transition-colors duration-200',
              error ? 'border-danger/70' : 'border-hair hover:border-faint focus:border-ink',
            )}
            {...props}
          />
          <Calendar
            className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
            aria-hidden
          />
        </div>
        {error ? (
          <p id={errorId} role="alert" className="mt-1.5 px-1 text-[12.5px] text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

DateInput.displayName = 'DateInput';
