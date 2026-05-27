import { Pencil } from 'lucide-react';

import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';

export const MfCollectionCard = ({ collection }) => {
  const { title, description, noOfFunds, lastUpdated } = collection;

  return (
    <Card
      title={title}
      description={description}
      padding="lg"
      titleUnderline={false}
      className="h-full shadow-none"
      headerClassName="items-start"
      titleClassName="truncate text-lg font-semibold leading-tight"
      descriptionClassName="mt-1 text-xs text-paragraph/70"
      action={
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 border-stroke-divider bg-layer2 px-4 font-semibold text-heading hover:bg-layer1"
          leftIcon={Pencil}
        >
          Edit
        </Button>
      }
    >
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-paragraph/60">No. of Funds</span>
          <span className="text-sm font-semibold text-heading">{noOfFunds}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-paragraph/60">Last updated on</span>
          <span className="text-sm font-semibold text-heading">{lastUpdated}</span>
        </div>
      </div>
    </Card>
  );
};
