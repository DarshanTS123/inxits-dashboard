const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const toDateKey = (value) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

export const formatTransactionGroupLabel = (dateValue, today = new Date()) => {
  const dateKey = toDateKey(dateValue);
  const todayKey = toDateKey(today.toISOString().slice(0, 10));

  if (dateKey === todayKey) {
    return 'Today';
  }

  const date = new Date(`${dateKey}T00:00:00`);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const filterTransactions = (items, { type, dateRange }) => {
  const startKey = dateRange?.start ? toDateKey(dateRange.start) : null;
  const endKey = dateRange?.end ? toDateKey(dateRange.end) : null;

  return items.filter((item) => {
    const matchesType = !type || item.transactionType === type;
    const itemDateKey = toDateKey(item.date);

    const matchesStart = !startKey || itemDateKey >= startKey;
    const matchesEnd = !endKey || itemDateKey <= endKey;

    return matchesType && matchesStart && matchesEnd;
  });
};

export const groupTransactionsByDate = (items, today = new Date()) => {
  const groups = new Map();

  items.forEach((item) => {
    const dateKey = toDateKey(item.date);
    if (!groups.has(dateKey)) {
      groups.set(dateKey, {
        dateKey,
        label: formatTransactionGroupLabel(item.date, today),
        items: [],
      });
    }
    groups.get(dateKey).items.push(item);
  });

  return Array.from(groups.values()).sort((a, b) =>
    b.dateKey.localeCompare(a.dateKey)
  );
};

export const getTransactionStatusStyles = (status) => {
  switch (status) {
    case 'Completed':
      return { dot: 'bg-success', text: 'text-success' };
    case 'Failed':
      return { dot: 'bg-error', text: 'text-error' };
    case 'In Progress':
      return { dot: 'bg-warning', text: 'text-warning' };
    default:
      return { dot: 'bg-paragraph/60', text: 'text-paragraph' };
  }
};
