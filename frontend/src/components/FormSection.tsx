import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  aside?: ReactNode;
}

export function FormSection({ title, description, children, className, aside }: FormSectionProps) {
  return (
    <section className={cn('border-t border-hair pt-8', className)}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-faint">{title}</h3>
          {description ? <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-mute">{description}</p> : null}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

interface FieldGridProps {
  children: ReactNode;
  columns?: 1 | 2;
  className?: string;
}

export function FieldGrid({ children, columns = 2, className }: FieldGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-x-5 gap-y-1',
        columns === 2 && 'md:grid-cols-2',
        className,
      )}
    >
      {children}
    </div>
  );
}
