import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  alt?: string;
  priority?: boolean;
}

/**
 * Typographic "clientbrief" wordmark shown across the app.
 */
export function BrandLogo({ className, alt = 'clientbrief' }: BrandLogoProps) {
  return (
    <span
      role="img"
      aria-label={alt}
      className={cn(
        'inline-flex items-center font-display text-2xl font-semibold leading-none tracking-tightest text-ink',
        className,
      )}
    >
      clientbrief
    </span>
  );
}
