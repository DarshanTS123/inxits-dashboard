import { cn } from '@utils/cn';

export const DetailField = ({ label, value, className }) => (
  <div className={className}>
    <div className="mb-1 text-xs text-paragraph/70">{label}</div>
    <div className="text-sm font-semibold text-heading">{value ?? '-'}</div>
  </div>
);

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
};

export const DetailFieldGrid = ({
  fields = [],
  cols = 2,
  className,
  fieldClassName,
}) => (
  <div
    className={cn(
      'grid gap-x-4 gap-y-4 sm:gap-y-6',
      gridCols[cols] ?? gridCols[2],
      className
    )}
  >
    {fields.map((field) => (
      <DetailField
        key={field.label}
        label={field.label}
        value={field.value}
        className={fieldClassName}
      />
    ))}
  </div>
);
