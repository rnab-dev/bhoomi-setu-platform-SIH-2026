
import { cn } from '@/utils';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while trying to load the data. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center border border-destructive/20 rounded-lg bg-brick-tint/30', className)}>
      <div className="mb-4 text-destructive p-4 bg-brick-tint rounded-full">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-medium text-destructive mb-1">{title}</h3>
      <p className="text-sm text-destructive/80 max-w-sm mb-6">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
