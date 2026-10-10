import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StepLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function StepLayout({ title, description, children, className }: StepLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('w-full', className)}
    >
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow mb-3">{title}</p>
        <h2 className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium leading-[1.15] tracking-tight text-ink">
          {description}
        </h2>
      </header>
      <div className="flex flex-col gap-12">{children}</div>
    </motion.div>
  );
}
