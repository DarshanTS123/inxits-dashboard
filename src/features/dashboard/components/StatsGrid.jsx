import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';

export const StatsGrid = ({ stats = [], loading }) => {
  const getStatData = (label) => stats.find((s) => s.label === label);

  const items = [
    { label: 'Total Clients', ...getStatData('Total Clients') },
    { label: 'Total AUM', ...getStatData('Total AUM') },
    { label: 'SIP Amount', ...getStatData('SIP Amount') },
    { label: 'SIP Accounts', ...getStatData('SIP Count') },
    { label: 'Active Tasks', ...getStatData('Open Support Tickets') },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item, index) => (
        <Card
          key={index}
          padding="md"
          label={item.label}
          value={item.value || '-'}
          meta={
            item.link && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-0 text-[11px] font-semibold uppercase tracking-wide text-primary hover:bg-transparent hover:text-primary/80"
              >
                {item.link}
              </Button>
            )
          }
          loading={loading}
          loadingFallback={
            <div className="flex flex-col gap-2 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-28" />
              <div className="h-8 bg-slate-800 rounded w-24 animate-pulse" />
            </div>
          }
        />
      ))}
    </div>
  );
};
