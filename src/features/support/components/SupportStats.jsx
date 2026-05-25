import { Card } from '@/components/ui/Card/Card';
import { cn } from '@/utils/cn';

export const SupportStats = ({ stats = [], loading }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card
          key={index}
          padding="md"
          loading={loading}
          skeletonRows={1}
          className="rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {stat.color && (
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full shadow-sm",
                    stat.color === 'blue' ? "bg-info" : "bg-success"
                  )}
                />
              )}
              <span className="text-[15px] font-normal text-paragraph/90">
                {stat.label}
              </span>
            </div>
            <span className="text-[18px] font-bold text-heading">
              {stat.value}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
