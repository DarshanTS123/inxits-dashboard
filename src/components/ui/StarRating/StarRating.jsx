import { Star } from 'lucide-react';

import { cn } from '@/utils/cn';

export function StarRating({
  value = 0,
  max = 5,
  className,
  filledClassName = 'fill-warning text-warning',
  emptyClassName = 'fill-transparent text-text-disabled',
  iconClassName = 'h-4 w-4',
}) {
  const rating = Math.max(0, Math.min(max, Number(value) || 0));

  return (
    <span
      aria-label={`${rating} out of ${max} stars`}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {Array.from({ length: max }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn(
            iconClassName,
            index < rating ? filledClassName : emptyClassName
          )}
        />
      ))}
    </span>
  );
}
