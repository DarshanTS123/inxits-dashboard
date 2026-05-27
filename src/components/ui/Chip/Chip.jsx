import { X } from 'lucide-react';
import { cn } from '@utils/cn';

const chipVariants = {
  default:
    'border border-stroke-divider bg-layer2 text-primary',
  subtle: 'border border-transparent bg-helper text-heading',
};

const chipSizes = {
  sm: 'h-7 gap-1 px-2.5 text-xs',
  md: 'h-8 gap-1.5 px-3 text-sm',
};

export function Chip({
  label,
  children,
  onRemove,
  className,
  variant = 'default',
  size = 'md',
  removeAriaLabel,
  labelClassName,
}) {
  const content = children ?? label;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full font-normal',
        chipVariants[variant],
        chipSizes[size],
        className
      )}
    >
      <span className={cn('max-w-[180px] truncate', labelClassName)}>{content}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-0.5 text-primary/80 transition-colors hover:bg-white/10 hover:text-primary"
          aria-label={removeAriaLabel ?? `Remove ${label ?? 'item'}`}
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}

export function ChipGroup({
  items = [],
  onRemove,
  className,
  chipClassName,
  getItemKey = (item) => item.id,
  getItemLabel = (item) => item.label,
}) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        'custom-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto',
        className
      )}
    >
      {items.map((item) => (
        <Chip
          key={getItemKey(item)}
          label={getItemLabel(item)}
          onRemove={onRemove ? () => onRemove(item) : undefined}
          className={chipClassName}
        />
      ))}
    </div>
  );
}
