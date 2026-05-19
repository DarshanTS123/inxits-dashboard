import * as React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/utils/cn';

const RANGE_BAR =
  'h-[var(--calendar-range-bar-height)] w-full max-w-9';

function CalendarDayButton({ className, day, modifiers, ...props }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isSelectedSingle =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle;

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toISOString()}
      data-selected-single={isSelectedSingle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'relative z-10 flex h-9 w-9 flex-col items-center justify-center rounded-md text-sm font-normal text-heading transition-colors',
        'hover:bg-layer2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        'data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-heading hover:data-[range-middle=true]:bg-transparent',
        'data-[range-middle=true]:h-[var(--calendar-range-bar-height)]',
        'data-[range-start=true]:rounded-l-md data-[range-start=true]:rounded-r-none data-[range-start=true]:bg-[var(--calendar-range-endpoint)] data-[range-start=true]:text-text-on-primary hover:data-[range-start=true]:bg-[var(--calendar-range-endpoint)]',
        'data-[range-end=true]:rounded-r-md data-[range-end=true]:rounded-l-none data-[range-end=true]:bg-[var(--calendar-range-endpoint)] data-[range-end=true]:text-text-on-primary hover:data-[range-end=true]:bg-[var(--calendar-range-endpoint)]',
        'data-[range-start=true]:data-[range-end=true]:rounded-md',
        'data-[range-start=true]:h-[var(--calendar-range-bar-height)] data-[range-end=true]:h-[var(--calendar-range-bar-height)]',
        'data-[selected-single=true]:h-[var(--calendar-range-bar-height)] data-[selected-single=true]:bg-[var(--calendar-range-endpoint)] data-[selected-single=true]:text-text-on-primary hover:data-[selected-single=true]:bg-[var(--calendar-range-endpoint)]',
        (modifiers.range_start || modifiers.range_end) && RANGE_BAR,
        modifiers.outside && 'text-paragraph/40 hover:bg-transparent',
        modifiers.disabled && 'pointer-events-none opacity-40',
        className
      )}
      {...props}
    >
      <span>{day.date.getDate()}</span>
      {modifiers.today && !modifiers.selected && !modifiers.range_middle && (
        <span
          className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
          aria-hidden
        />
      )}
    </button>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('relative flex flex-col', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-3', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between',
          defaultClassNames.nav
        ),
        button_previous: cn(
          'inline-flex h-6 w-6 items-center justify-center rounded-full border border-stroke-divider bg-layer1 text-heading transition-colors hover:bg-layer2 disabled:opacity-40',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          'inline-flex h-6 w-6 items-center justify-center rounded-full border border-stroke-divider bg-layer1 text-heading transition-colors hover:bg-layer2 disabled:opacity-40',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-7 w-full items-center justify-center px-7',
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          'text-xs font-semibold text-heading select-none',
          defaultClassNames.caption_label
        ),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex h-8 flex-1 items-center justify-center text-xs font-medium uppercase text-paragraph/70 select-none',
          defaultClassNames.weekday
        ),
        week: cn('mt-1 flex w-full', defaultClassNames.week),
        day: cn(
          'relative flex h-9 w-9 items-center justify-center p-0 text-center select-none',
          defaultClassNames.day
        ),
        range_start: cn('rounded-none', defaultClassNames.range_start),
        range_middle: cn(
          'rounded-none bg-transparent',
          'after:pointer-events-none after:absolute after:inset-x-0 after:top-1/2 after:z-0 after:h-[var(--calendar-range-bar-height)] after:w-full after:-translate-y-1/2 after:rounded-none after:bg-[var(--calendar-range-fill)] after:content-[""]',
          defaultClassNames.range_middle
        ),
        range_end: cn('rounded-none', defaultClassNames.range_end),
        today: cn('text-primary', defaultClassNames.today),
        outside: cn('text-paragraph/40', defaultClassNames.outside),
        disabled: cn('text-paragraph/30 opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
          return <Icon className={cn('h-4 w-4', chevronClassName)} {...chevronProps} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      formatters={{
        formatWeekdayName: (date) =>
          date.toLocaleDateString('en-US', { weekday: 'narrow' }),
        ...props.formatters,
      }}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
