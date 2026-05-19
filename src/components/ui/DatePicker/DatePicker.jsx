import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/Calendar/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover/Popover';
import { Button } from '@/components/ui/Button/Button';
import { cn } from '@/utils/cn';
import { formatDatePickerDate, formatDatePickerRange } from '@/utils/date';

function getDisplayLabel(mode, value, placeholder) {
  if (mode === 'range') {
    const label = formatDatePickerRange(value);
    return label || placeholder;
  }

  const label = formatDatePickerDate(value);
  return label || placeholder;
}

function DatePickerFooter({ onCancel, onApply, applyDisabled }) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-stroke-divider px-3 py-2.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 min-w-[72px] px-4 text-xs"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="button"
        size="sm"
        className="h-8 min-w-[72px] px-4 text-xs"
        disabled={applyDisabled}
        onClick={onApply}
      >
        Apply
      </Button>
    </div>
  );
}

function DatePicker({
  mode = 'single',
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  className,
  triggerClassName,
  align = 'end',
  showFooter = true,
  calendarProps,
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(defaultValue);

  const selected = isControlled ? value : internalValue;

  const resolvedPlaceholder =
    placeholder ?? (mode === 'range' ? 'Select date range' : 'Select date');

  const displayLabel = getDisplayLabel(mode, selected, resolvedPlaceholder);

  const commitValue = (nextValue) => {
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  const handleApply = () => {
    commitValue(draft);
    setOpen(false);
  };

  const handleCancel = () => {
    setDraft(selected);
    setOpen(false);
  };

  const handleOpenChange = (nextOpen) => {
    setDraft(selected);
    setOpen(nextOpen);
  };

  const handleSelect = (nextValue) => {
    setDraft(nextValue);
    if (!showFooter) {
      commitValue(nextValue);
      setOpen(false);
    }
  };

  const canApply =
    mode === 'single'
      ? Boolean(draft)
      : Boolean(draft?.from) && Boolean(draft?.to);

  const hasSelection = mode === 'range' ? Boolean(selected?.from) : Boolean(selected);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'inline-flex h-9 w-full min-w-[220px] items-center justify-between gap-2 rounded-md border border-stroke-divider bg-layer1 px-4 text-xs font-normal text-heading transition-colors',
            'hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            triggerClassName,
            className
          )}
        >
          <span className={cn(!hasSelection && 'text-paragraph/70')}>{displayLabel}</span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-paragraph/80" aria-hidden />
        </button>
      </PopoverTrigger>

      <PopoverContent align={align} className="w-auto">
        <Calendar
          mode={mode}
          selected={draft}
          onSelect={handleSelect}
          defaultMonth={mode === 'range' ? draft?.from ?? draft?.to : draft}
          {...calendarProps}
        />

        {showFooter && (
          <DatePickerFooter
            onCancel={handleCancel}
            onApply={handleApply}
            applyDisabled={!canApply}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
