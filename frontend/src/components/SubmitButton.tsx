import { ArrowRight, Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';

interface SubmitButtonProps extends Omit<ButtonProps, 'children'> {
  label: string;
  loadingLabel: string;
  loading?: boolean;
}

export function SubmitButton({ label, loadingLabel, loading, className, disabled, ...props }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={disabled || loading}
      className={cn('group w-full sm:w-auto', className)}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {loadingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            aria-hidden
          />
        </>
      )}
    </Button>
  );
}
