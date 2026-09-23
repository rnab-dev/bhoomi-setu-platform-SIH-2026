import type { ReactNode } from 'react';
import { cn } from '@/utils';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ 
  title = 'No data found', 
  description = 'There is currently no data to display here.',
  icon,
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg bg-paper/50 border-line', className)}>
      <div className="mb-4 text-text-faint p-4 bg-paper rounded-full">
        {icon || <FileQuestion className="h-10 w-10" />}
      </div>
      <h3 className="text-lg font-medium text-ink mb-1">{title}</h3>
      <p className="text-sm text-text-mute max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
