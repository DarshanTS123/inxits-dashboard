import { useMemo } from 'react';

import { Card } from '@components/ui/Card/Card';
import { Button } from '@components/ui/Button/Button';
import GaugeChart from '@components/charts/GaugeChart';
import { cn } from '@utils/cn';
import { DetailFieldGrid } from './DetailField';

const detailCardTitleClass = 'text-base text-heading';

const StatusDot = ({ variant }) => (
  <span
    className={cn(
      'h-2 w-2 rounded-full',
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
        'text-xs',
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
      contentClassName: 'flex flex-col gap-6 sm:flex-row',
      content: (
        <>
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-layer2">
            <img
              src={client.avatarUrl}
              alt={`${client.clientName} profile`}
              className="h-full w-full object-cover"
            />
          </div>
          <DetailFieldGrid
            cols={2}
            className="flex-1"
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
      title: 'Risk Profile',
      contentClassName: 'flex flex-col items-center gap-8 lg:flex-row',
      content: (
        <>
          <div className="flex w-full flex-1 flex-col items-center">
            <GaugeChart
              value={riskProfile.value}
              label={riskProfile.label}
              height={180}
              className="w-full border-0 bg-transparent p-0 shadow-none hover:border-transparent"
            />
          </div>
          <div className="w-full flex-1 space-y-4">
            <div className="text-xs text-paragraph/70">
              Asset Allocation by Risk Profile
            </div>
            <DetailFieldGrid
              cols={3}
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
                className="h-auto px-0 py-0 text-xs font-medium text-primary hover:bg-transparent hover:underline"
              >
                View Reason List &gt;
              </Button>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'kyc',
      title: 'KYC Status',
      action: (
        <StatusBadge
          variant={kycCompleted ? 'success' : 'warning'}
          label={kyc.status}
        />
      ),
      content: (
        <DetailFieldGrid
          cols={2}
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
      action: (
        <StatusBadge
          variant={rmAssigned ? 'success' : 'warning'}
          label={rm.status}
        />
      ),
      contentClassName: 'flex flex-col items-end justify-between gap-4 sm:flex-row',
      content: (
        <>
          <DetailFieldGrid
            cols={1}
            className="w-full flex-1 sm:max-w-md"
            fields={[
              { label: 'RM Name & ID', value: rm.name },
              { label: 'Email ID', value: rm.email },
            ]}
          />
          <Button variant="outline" size="sm" type="button">
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {cards.map((card) => (
        <Card
          key={card.id}
          padding="lg"
          title={card.title}
          titleUnderline={false}
          titleClassName={detailCardTitleClass}
          action={card.action}
          contentClassName={card.contentClassName}
        >
          {card.content}
        </Card>
      ))}
    </div>
  );
};
