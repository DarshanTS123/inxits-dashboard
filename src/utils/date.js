import { format, isValid, parseISO } from 'date-fns';

export const DATE_PICKER_DISPLAY_FORMAT = 'dd MMM yy';

export function toDate(value) {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;
  const parsed = parseISO(String(value));
  return isValid(parsed) ? parsed : undefined;
}

export function formatDatePickerDate(date) {
  if (!date || !isValid(date)) return '';
  return format(date, DATE_PICKER_DISPLAY_FORMAT);
}

export function formatDatePickerRange(range) {
  if (!range?.from) return '';
  if (!range.to) return formatDatePickerDate(range.from);
  return `${formatDatePickerDate(range.from)} - ${formatDatePickerDate(range.to)}`;
}

export function formatDate(date, formatStr = 'dd MMM yyyy') {
  const d = toDate(date);
  if (!d) return '';
  return format(d, formatStr);
}

export function toIsoDateString(date) {
  if (!date || !isValid(date)) return '';
  return format(date, 'yyyy-MM-dd');
}

/** API shape `{ start, end }` → react-day-picker `{ from, to }`. */
export function apiDateRangeToPicker(dateRange) {
  if (!dateRange?.start) return undefined;

  const from = toDate(dateRange.start);
  const to = toDate(dateRange.end);

  if (!from) return undefined;

  return { from, to: to ?? from };
}

/** react-day-picker range → API filter shape `{ start, end, label }`. */
export function pickerRangeToApiDateRange(range) {
  if (!range?.from) return null;

  const to = range.to ?? range.from;

  return {
    start: toIsoDateString(range.from),
    end: toIsoDateString(to),
    label: formatDatePickerRange({ from: range.from, to }),
  };
}
