import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Tabs } from '@components/ui/Tabs/Tabs';
import { Button } from '@components/ui/Button/Button';
import { Breadcrumbs } from '@components/ui/Breadcrumbs/Breadcrumbs';
import { ClientDetailSummaryCards } from './ClientDetailSummaryCards';
import { ClientDetailPersonalTab } from './ClientDetailPersonalTab';
import { ClientDetailPortfolioTab } from './ClientDetailPortfolioTab';
import { ClientDetailTransactionsTab } from './ClientDetailTransactionsTab';

const TabPlaceholder = ({ label }) => (
  <div className="rounded-lg border border-stroke-divider bg-layer1 p-8 text-center text-sm text-paragraph">
    {label} content is under development.
  </div>
);

export const ClientDetail = ({ client }) => {
  const tabs = useMemo(
    () => [
      {
        value: 'personal',
        label: 'Personal Details',
        content: <ClientDetailPersonalTab personalTab={client.personalTab} />,
        contentClassName: 'space-y-4',
      },
      {
        value: 'portfolio',
        label: 'Portfolios',
        content: <ClientDetailPortfolioTab />,
      },
      {
        value: 'transactions',
        label: 'Transactions',
        content: (
          <ClientDetailTransactionsTab
            key={client.id}
            transactionsTab={client.transactionsTab}
          />
        ),
      },
      {
        value: 'family',
        label: 'Family member',
        content: <TabPlaceholder label="Family member" />,
      },
      {
        value: 'reports',
        label: 'Reports',
        content: <TabPlaceholder label="Reports" />,
      },
    ],
    [client.personalTab, client.transactionsTab]
  );

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <Breadcrumbs
        items={[
          { label: 'Clients', href: '/clients' },
          { label: client.clientName },
        ]}
      />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-heading">{client.clientName}</h1>
      </div>

      <ClientDetailSummaryCards client={client} />

      <div className="mt-6">
        <Tabs
          items={tabs}
          defaultValue="personal"
          listClassName="mb-4 flex-wrap"
        />
      </div>
    </div>
  );
};

export const ClientDetailNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <Breadcrumbs
        items={[
          { label: 'Clients', href: '/clients' },
          { label: 'Not found' },
        ]}
      />
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-xl border border-stroke-divider bg-layer1 p-8 text-center">
        <h1 className="text-2xl font-bold text-heading">Client not found</h1>
        <p className="max-w-md text-sm text-paragraph">
          The client you are looking for does not exist or may have been removed.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/clients')}
        >
          Back to clients
        </Button>
      </div>
    </div>
  );
};

export const ClientDetailError = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <Breadcrumbs
        items={[
          { label: 'Clients', href: '/clients' },
          { label: 'Error' },
        ]}
      />
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-xl border border-stroke-divider bg-layer1 p-8 text-center">
        <h1 className="text-2xl font-bold text-heading">
          Unable to load client
        </h1>
        <p className="max-w-md text-sm text-paragraph">
          Something went wrong while loading this client. Please try again.
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button type="button" onClick={() => navigate('/clients')}>
            Back to clients
          </Button>
        </div>
      </div>
    </div>
  );
};
