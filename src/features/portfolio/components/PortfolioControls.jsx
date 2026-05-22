import { Download } from 'lucide-react';

import { Button } from '@/components/ui/Button/Button';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { Select } from '@/components/ui/Select/Select';

const DEFAULT_DATE_RANGE = {
  from: new Date(2024, 8, 1),
  to: new Date(2024, 8, 26),
};

const portfolioOptions = [
  { label: 'Consolidated Portfolio', value: 'consolidated' },
  { label: 'Inxits Portfolio', value: 'inxits' },
  { label: 'Finfactor Portfolio', value: 'finfactor' },
];

export function PortfolioControls() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold italic text-paragraph">
        NAV updated as on 19 Sept 2025.
      </p>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Select
          defaultValue="consolidated"
          options={portfolioOptions}
          triggerProps={{ 'aria-label': 'Portfolio scope' }}
          triggerClassName="h-12 w-full bg-layer1 px-4 text-base font-normal sm:w-56"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled
            leftIcon={Download}
            className="h-12 min-w-36 border-stroke-divider bg-layer1 text-text-disabled"
          >
            Download
          </Button>
          <DatePicker
            mode="range"
            defaultValue={DEFAULT_DATE_RANGE}
            align="end"
            triggerClassName="h-12 w-full text-base hover:bg-layer2 sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
