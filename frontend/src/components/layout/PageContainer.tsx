import type { ReactNode } from 'react';
import { cn } from '@/utils';

interface PageContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  description,
  children,
  action,
  className,
}: PageContainerProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-text-mute">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
