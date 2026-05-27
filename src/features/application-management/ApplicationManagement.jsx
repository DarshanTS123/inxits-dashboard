import { useState } from 'react';
import { Plus } from 'lucide-react';

import { useApplicationManagementData } from './api/applicationManagement';
import { RiskProfiles } from './components/RiskProfiles';
import { MfCollections } from './components/MfCollections';
import { PopularFunds } from './components/PopularFunds';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import { Button } from '@/components/ui/Button/Button';
import { PageLoader } from '@/components/ui/PageLoader';

export const ApplicationManagement = () => {
  const { data, isLoading } = useApplicationManagementData();
  const [activeTab, setActiveTab] = useState('risk-profiles');

  if (isLoading && !data) {
    return <PageLoader />;
  }

  const tabItems = [
    {
      value: 'risk-profiles',
      label: 'Risk Profiles',
      content: (
        <RiskProfiles profiles={data?.riskProfiles} loading={isLoading} />
      ),
    },
    {
      value: 'mf-collections',
      label: 'MF Collections',
      content: (
        <MfCollections collections={data?.mfCollections} loading={isLoading} />
      ),
    },
    {
      value: 'popular-funds',
      label: 'Popular Funds',
      content: (
        <PopularFunds categories={data?.popularFunds} loading={isLoading} />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs italic text-paragraph/60">
          NAV updated as on {data?.navLastUpdated || 'Loading...'}.
        </p>
      </div>

      <Tabs
        items={tabItems}
        value={activeTab}
        onValueChange={setActiveTab}
        variant="default"
        contentClassName="p-0"
        listClassName="flex-wrap"
        containerClassName="border-b-0"
        addon={
          activeTab === 'mf-collections' ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="h-9 shrink-0 px-4 font-semibold"
              leftIcon={Plus}
            >
              Create Collection
            </Button>
          ) : null
        }
      />
    </div>
  );
};
