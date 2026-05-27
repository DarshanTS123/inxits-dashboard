import { Eye, Plus } from 'lucide-react';

import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';

export const PopularFundCard = ({ category }) => {
  const { title, noOfCategories, noOfFunds, lastUpdated } = category;

  return (
    <Card
      title={title}
      padding="lg"
      titleUnderline={false}
      className="h-full shadow-none"
      headerClassName="items-start"
      titleClassName="text-lg font-semibold leading-tight"
      action={
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 border-stroke-divider bg-transparent px-4 font-semibold text-heading hover:bg-layer1"
            leftIcon={Eye}
          >
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="h-9 gap-2 px-4 font-semibold"
            leftIcon={Plus}
          >
            Add Fund
          </Button>
        </div>
      }
      footer={
        <div className="text-[11px] text-paragraph/50">
          Last updated on : {lastUpdated}
        </div>
      }
      footerClassName="pt-4"
    >
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-paragraph/60">No. of Category</span>
          <span className="text-sm font-semibold text-heading">{noOfCategories}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-paragraph/60">No. of Funds</span>
          <span className="text-sm font-semibold text-heading">{noOfFunds}</span>
        </div>
      </div>
    </Card>
  );
};
