import { Card } from '@/components/ui/Card/Card';
import { cn } from '@/utils/cn';

export function PortfolioMetricCards({ metrics = [], loading = false }) {
  const cards = loading
    ? Array.from({ length: 5 }, (_, index) => ({ id: index }))
    : metrics;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Card
          key={card.id}
          padding="sm"
          label={card.label}
          value={card.value}
          loading={loading}
          skeletonRows={2}
          meta={
            card.meta || card.suffix ? (
              <span>
                {card.meta && (
                  <span className={cn(card.metaClassName)}>{card.meta}</span>
                )}{' '}
                {card.suffix}
              </span>
            ) : null
          }
          labelClassName="tracking-normal"
          valueClassName="text-lg font-semibold"
          className="rounded-xl"
        />
      ))}
    </div>
  );
}
