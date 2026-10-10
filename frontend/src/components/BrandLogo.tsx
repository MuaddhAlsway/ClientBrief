import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  alt?: string;
  priority?: boolean;
}

/**
 * The original MU.LAB logo. Displayed as-is (white mark on pure black),
 * served from /logo.png. Falls back to a typographic wordmark if the
 * asset cannot be loaded.
 */
export function BrandLogo({ className, alt = 'MU.LAB', priority = false }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn('font-display font-semibold tracking-tightest text-ink', className)}
        aria-label={alt}
        role="img"
      >
        MU<span className="text-faint">.</span>LAB
      </span>
    );
  }

  return (
    <img
      src="/logo.png"
      alt={alt}
      width={160}
      height={56}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('h-10 w-auto select-none object-contain', className)}
    />
  );
}
