import { useMemo } from 'react';
import { FileText, Pencil } from 'lucide-react';

import { Card } from '@components/ui/Card/Card';
import { Button } from '@components/ui/Button/Button';
import { cn } from '@utils/cn';
import { DetailFieldGrid } from './DetailField';

const detailCardTitleClass = 'text-base text-heading';

const DocumentChip = ({ label, active }) => (
  <div className="flex items-center gap-2 rounded-md border border-stroke-divider bg-layer2 px-4 py-2">
    <FileText
      className={cn('h-4 w-4 shrink-0', active ? 'text-primary' : 'text-paragraph')}
      aria-hidden
    />
    <span
      className={cn(
        'text-sm font-medium',
        active ? 'text-primary' : 'text-paragraph'
      )}
    >
      {label}
    </span>
  </div>
);

const buildPersonalTabCards = (personalTab) => [
  {
    id: 'identity',
    title: 'Personal Details',
    content: <DetailFieldGrid cols={4} fields={personalTab.identity} />,
  },
  {
    id: 'address',
    title: 'Address & Contact',
    content: (
      <>
        <div className="mb-4 text-sm font-medium text-heading">
          {personalTab.address.sectionTitle}
        </div>
        <DetailFieldGrid cols={5} fields={personalTab.address.fields} />
      </>
    ),
  },
  {
    id: 'nominees',
    title: 'Nominee Details',
    action: (
      <Button variant="outline" size="sm" type="button" leftIcon={Pencil}>
        Edit Details
      </Button>
    ),
    content: (
      <div className="space-y-6">
        {personalTab.nominees.map((nominee, index) => (
          <div key={nominee.title}>
            {index > 0 && <div className="mb-6 h-px bg-stroke-divider" />}
            <div className="mb-4 text-sm font-medium text-heading">
              {nominee.title}
            </div>
            <DetailFieldGrid cols={3} fields={nominee.fields} />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'fatca',
    title: 'Fatca Details',
    content: <DetailFieldGrid cols={3} fields={personalTab.fatca} />,
  },
  {
    id: 'bank',
    title: 'Bank Account',
    content: <DetailFieldGrid cols={3} fields={personalTab.bank} />,
  },
  {
    id: 'documents',
    title: 'Document Uploads',
    content: (
      <div className="flex flex-wrap gap-4">
        {personalTab.documents.map((doc) => (
          <DocumentChip key={doc.label} label={doc.label} active={doc.active} />
        ))}
      </div>
    ),
  },
];

export const ClientDetailPersonalTab = ({ personalTab }) => {
  const cards = useMemo(() => buildPersonalTabCards(personalTab), [personalTab]);

  return (
    <div className="space-y-4">
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
