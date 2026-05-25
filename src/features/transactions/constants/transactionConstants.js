export const TRANSACTION_TABS = [
  { label: 'Order Placed', value: 'order-placed' },
  { label: 'In Process', value: 'in-process' },
  { label: 'Settled', value: 'settled' },
  { label: 'Failed', value: 'failed' },
  { label: 'All', value: 'all' },
];

export const TRANSACTION_STATUS_COLORS = {
  'Order Placed': 'text-paragraph',
  'In process': 'text-warning',
  'Settled': 'text-success',
  'Failed': 'text-error',
  'Units Allotted': 'text-info',
};

export const TRANSACTION_STATUS_DOTS = {
  'Order Placed': 'bg-paragraph',
  'In process': 'bg-warning',
  'Settled': 'bg-success',
  'Failed': 'bg-error',
  'Units Allotted': 'bg-info',
};
