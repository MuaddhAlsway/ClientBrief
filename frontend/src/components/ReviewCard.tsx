import type { ReactNode } from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReviewRow {
  label: string;
  value: ReactNode;
}

interface ReviewCardProps {
  title: string;
  rows: ReviewRow[];
  onEdit?: () => void;
  editLabel: string;
  className?: string;
}

export function ReviewCard({ title, rows, onEdit, editLabel, className }: ReviewCardProps) {
  return (
    <section className={cn('rounded-2xl border border-hair bg-card', className)}>
      <header className="flex items-center justify-between gap-4 border-b border-hair px-5 py-4">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">{title}</h3>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-hair px-2.5 py-1.5 text-[12px] text-mute transition-colors hover:border-faint hover:text-ink"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            {editLabel}
          </button>
        ) : null}
      </header>
      <dl className="flex flex-col divide-y divide-hair">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt className="text-[12.5px] text-faint">{row.label}</dt>
            <dd className="text-[13.5px] leading-relaxed text-ink">
              {row.value === '' || row.value === undefined || row.value === null ? (
                <span className="text-faint">—</span>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
