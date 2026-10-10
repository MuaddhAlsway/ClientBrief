import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const FLOAT_CLASSES = cn(
  'peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.14em]',
  'peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.14em]',
);

interface BaseFieldProps {
  label: string;
  error?: string;
  optional?: string;
  hint?: string;
}

type FloatingLabelInputProps = BaseFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
    containerClassName?: string;
  };

export const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, optional, hint, placeholder, id, containerClassName, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    return (
      <div className={cn('w-full', containerClassName)}>
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            placeholder={placeholder ?? ' '}
            aria-invalid={Boolean(error)}
            aria-describedby={cn(error && errorId, hint && hintId) || undefined}
            className={cn(
              'peer h-[66px] w-full rounded-xl border bg-elevated px-4 pb-2 pt-7 text-[15px] text-ink outline-none transition-colors duration-200',
              'placeholder:text-transparent focus:placeholder:text-faint',
              error ? 'border-danger/70' : 'border-hair hover:border-faint focus:border-ink',
            )}
            {...props}
          />
          <label
            htmlFor={fieldId}
            className={cn(
              'pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[15px] text-mute transition-all duration-200 ease-premium',
              FLOAT_CLASSES,
            )}
          >
            {label}
            {optional ? <span className="ms-1.5 lowercase tracking-normal text-faint">({optional})</span> : null}
          </label>
        </div>
        <FieldMessage error={error} hint={hint} errorId={errorId} hintId={hintId} />
      </div>
    );
  },
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

type AnimatedTextareaProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
    containerClassName?: string;
  };

export const AnimatedTextarea = forwardRef<HTMLTextAreaElement, AnimatedTextareaProps>(
  ({ label, error, optional, hint, id, containerClassName, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    return (
      <div className={cn('w-full', containerClassName)}>
        <div className="relative">
          <textarea
            ref={ref}
            id={fieldId}
            rows={rows}
            aria-invalid={Boolean(error)}
            aria-describedby={cn(error && errorId, hint && hintId) || undefined}
            className={cn(
              'peer w-full resize-y rounded-xl border bg-elevated px-4 pb-3 pt-7 text-[15px] leading-relaxed text-ink outline-none transition-colors duration-200',
              'placeholder:text-faint',
              error ? 'border-danger/70' : 'border-hair hover:border-faint focus:border-ink',
            )}
            {...props}
          />
          <label
            htmlFor={fieldId}
            className="pointer-events-none absolute start-4 top-2.5 text-[11px] uppercase tracking-[0.14em] text-mute"
          >
            {label}
            {optional ? <span className="ms-1.5 lowercase tracking-normal text-faint">({optional})</span> : null}
          </label>
        </div>
        <FieldMessage error={error} hint={hint} errorId={errorId} hintId={hintId} />
      </div>
    );
  },
);

AnimatedTextarea.displayName = 'AnimatedTextarea';

function FieldMessage({
  error,
  hint,
  errorId,
  hintId,
}: {
  error?: string;
  hint?: string;
  errorId: string;
  hintId: string;
}) {
  if (!error && !hint) return null;
  return (
    <div className="mt-1.5 min-h-[18px] px-1 text-[12.5px] leading-tight">
      {error ? (
        <p id={errorId} role="alert" className="text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
