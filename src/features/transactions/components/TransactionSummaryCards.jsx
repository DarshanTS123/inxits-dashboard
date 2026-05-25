import { Card } from '@/components/ui/Card/Card';

export const TransactionSummaryCards = ({ summary, isLoading }) => {
  const items = [
    { label: 'Lumpsum', value: summary?.lumpsum ?? 0 },
    { label: 'Redemption', value: summary?.redemption ?? 0 },
    { label: 'SIP', value: summary?.sip ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="p-4 border-stroke-divider bg-layer1">
          <div className="space-y-1">
            <p className="text-sm text-paragraph/70 font-medium">{item.label}</p>
            <p className="text-2xl font-semibold text-heading">
              {isLoading ? '...' : item.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};
