import { useMemo } from 'react';

import { Card } from '@components/ui/Card/Card';
import { Button } from '@components/ui/Button/Button';
import GaugeChart from '@components/charts/GaugeChart';
import { cn } from '@utils/cn';
import { DetailFieldGrid } from './DetailField';

const RISK_GAUGE_BANDS = [
  { start: 0, end: 20, color: '#1e9e58' },
  { start: 20, end: 40, color: '#8ec800' },
  { start: 40, end: 60, color: '#efbf00' },
  { start: 60, end: 80, color: '#e67e22' },
  { start: 80, end: 100, color: '#ea5758' },
];

const StatusDot = ({ variant }) => (
  <span
    className={cn(
      'h-2.5 w-2.5 rounded-full',
      variant === 'success' && 'bg-success',
      variant === 'warning' && 'bg-warning',
      variant !== 'success' && variant !== 'warning' && 'bg-paragraph/40'
    )}
  />
);

const StatusBadge = ({ variant, label }) => (
  <div className="flex items-center gap-2">
    <StatusDot variant={variant} />
    <span
      className={cn(
        'text-[13px] font-semibold leading-none',
        variant === 'success' && 'text-success',
        variant === 'warning' && 'text-warning',
        variant !== 'success' && variant !== 'warning' && 'text-paragraph'
      )}
    >
      {label}
    </span>
  </div>
);

const buildSummaryCards = (client) => {
  const { riskProfile, kyc, relationshipManager: rm } = client;
  const { allocation } = riskProfile;
  const kycCompleted = kyc.status === 'Completed';
  const rmAssigned = rm.status === 'Assigned';

  return [
    {
      id: 'personal',
      title: 'Personal Details',
      className: 'lg:col-span-7',
      contentClassName: 'flex flex-col gap-4 sm:flex-row sm:items-start',
      content: (
        <>
          <div className="h-[124px] w-[152px] shrink-0 overflow-hidden rounded-md bg-layer2">
            <img
              src={client.avatarUrl}
              alt={`${client.clientName} profile`}
              className="h-full w-full object-cover"
            />
          </div>
          <DetailFieldGrid
            cols={2}
            className="flex-1 gap-x-20 gap-y-2 pr-1 pt-1"
            fields={[
              { label: 'Email', value: client.personal.email },
              { label: 'Mobile', value: client.personal.mobile },
              { label: 'Gender', value: client.personal.gender },
              { label: 'Marital Status', value: client.personal.maritalStatus },
              { label: 'Status', value: client.personal.status },
            ]}
          />
        </>
      ),
    },
    {
      id: 'risk',
      title: 'Risk Profile Card',
      className: 'lg:col-span-5',
      contentClassName:
        'rounded-lg bg-layer2/70 px-4 py-3.5 md:px-6 md:py-4 flex flex-col items-center gap-5 lg:flex-row lg:items-center',
      content: (
        <>
          <div className="flex min-w-0 flex-1 flex-col items-center">
            <GaugeChart
              value={riskProfile.value}
              label={riskProfile.label}
              bands={RISK_GAUGE_BANDS}
              height={114}
              className="w-full min-w-[180px] border-0 bg-transparent p-0 shadow-none hover:border-transparent"
            />
          </div>
          <div className="w-full flex-1 space-y-5">
            <div className="text-[14px] font-normal leading-tight text-paragraph/75">
              Asset allocation by Risk Profile :
            </div>
            <DetailFieldGrid
              cols={3}
              className="grid-cols-3 gap-x-5 gap-y-1 sm:grid-cols-3 lg:grid-cols-3"
              fields={[
                { label: 'Large Cap', value: allocation.largeCap },
                { label: 'Small Cap', value: allocation.smallCap },
                { label: 'Debt', value: allocation.debt },
              ]}
            />
            <div className="text-right">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto rounded-none px-0 py-0 text-[10px] font-semibold text-primary hover:bg-transparent hover:underline"
              >
                View Assessment &gt;
              </Button>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'kyc',
      title: 'KYC Status',
      className: 'lg:col-span-6',
      action: (
        <StatusBadge
          variant={kycCompleted ? 'success' : 'warning'}
          label={kyc.status}
        />
      ),
      content: (
        <DetailFieldGrid
          cols={2}
          className="gap-x-24 gap-y-2"
          fields={[
            { label: 'Pan Card', value: kyc.panMasked },
            { label: 'Aadhaar Card', value: kyc.aadhaarMasked },
          ]}
        />
      ),
    },
    {
      id: 'rm',
      title: 'Relationship Manager',
      className: 'lg:col-span-6',
      action: (
        <StatusBadge
          variant={rmAssigned ? 'success' : 'warning'}
          label={rm.status}
        />
      ),
      contentClassName:
        'flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end',
      content: (
        <>
          <DetailFieldGrid
            cols={1}
            className="w-full flex-1 gap-y-3"
            fields={[
              { label: 'RM Name & ID', value: rm.name },
              { label: 'Email ID', value: rm.email },
            ]}
          />
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="h-9 rounded-md border-paragraph/60 px-5 text-[12px] font-bold text-heading"
          >
            Assign RM
          </Button>
        </>
      ),
    },
  ];
};

export const ClientDetailSummaryCards = ({ client }) => {
  const cards = useMemo(() => buildSummaryCards(client), [client]);

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
      {cards.map((card) => (
        <Card
          key={card.id}
          padding="none"
          title={card.title}
          titleUnderline={false}
          action={card.action}
          className={cn('rounded-lg p-4 shadow-none', card.className)}
          headerClassName="mb-3 items-center gap-3"
          titleClassName="leading-none"
          actionClassName="pt-0"
          contentClassName={card.contentClassName}
        >
          {card.content}
        </Card>
      ))}
    </div>
  );
};
