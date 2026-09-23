
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface LoadingStateProps {
  text?: string;
  className?: string;
}

export function LoadingState({ text = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-text-mute', className)}>
      <Loader2 className="h-8 w-8 animate-spin mb-4 text-accent" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
