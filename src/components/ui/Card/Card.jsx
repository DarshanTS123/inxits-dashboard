import React from 'react';
import { cn } from '@/utils/cn';

const cardVariants = {
  default: 'border-stroke-divider bg-layer1',
  muted: 'border-stroke-divider bg-layer2',
  elevated: 'border-stroke-divider bg-layer1 shadow-2xl shadow-black/20',
};

const cardPaddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

const skeletonWidths = {
  sm: 'w-16',
  md: 'w-24',
  lg: 'w-36',
  full: 'w-full',
};

const hasValue = (value) =>
  value !== undefined && value !== null && value !== false;

const renderNode = (node, fallbackProps = {}) => {
  if (typeof node === 'function') {
    return node(fallbackProps);
  }

  return node;
};

const CardSkeleton = ({ rows = 3 }) => (
  <div className="animate-pulse space-y-4">
    <div className="h-5 w-40 rounded bg-layer2" />
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-4 rounded bg-layer2',
            skeletonWidths[index === rows - 1 ? 'md' : 'full']
          )}
        />
      ))}
    </div>
  </div>
);

const CardEmptyState = ({
  emptyIcon,
  emptyTitle = 'No data available',
  emptyDescription,
}) => (
  <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-center text-paragraph/70">
    {emptyIcon && <div className="text-paragraph/70">{emptyIcon}</div>}
    <p className="text-sm font-medium text-paragraph">{emptyTitle}</p>
    {emptyDescription && (
      <p className="max-w-sm text-xs leading-5 text-paragraph/70">
        {emptyDescription}
      </p>
    )}
  </div>
);

/**
 * Layout container driven by props. Pass body markup as `children`.
 * For multiple cards, define an array in the parent and map each entry to `<Card />`.
 */
const Card = React.forwardRef(
  (
    {
      className,
      children,
      title,
      subtitle,
      description,
      action,
      footer,
      loading = false,
      loadingFallback,
      skeletonRows = 3,
      empty = false,
      emptyIcon,
      emptyTitle,
      emptyDescription,
      value,
      label,
      meta,
      href,
      onClick,
      as: Component = href ? 'a' : 'div',
      variant = 'default',
      padding = 'none',
      hoverable = false,
      interactive = Boolean(onClick || href),
      titleUnderline = true,
      headerClassName,
      titleClassName,
      subtitleClassName,
      descriptionClassName,
      actionClassName,
      contentClassName,
      footerClassName,
      valueClassName,
      labelClassName,
      metaClassName,
      ...props
    },
    ref
  ) => {
    const hasHeader =
      hasValue(title) ||
      hasValue(subtitle) ||
      hasValue(description) ||
      hasValue(action);
    const hasMetric = hasValue(label) || hasValue(value) || hasValue(meta);

    return (
      <Component
        ref={ref}
        href={href}
        onClick={onClick}
        className={cn(
          'rounded-2xl border shadow-xl transition-all',
          cardVariants[variant] || cardVariants.default,
          cardPaddings[padding] || padding,
          hoverable && 'hover:border-outline-active/40',
          interactive &&
            'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50',
          className
        )}
        {...props}
      >
        {loading ? (
          loadingFallback || <CardSkeleton rows={skeletonRows} />
        ) : empty ? (
          <CardEmptyState
            emptyIcon={emptyIcon}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        ) : (
          <>
            {hasHeader && (
              <header
                className={cn(
                  'flex flex-row items-start justify-between gap-4',
                  children && 'mb-4',
                  headerClassName
                )}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    {title && (
                      <h3
                        className={cn(
                          'text-[17px] font-medium tracking-tight text-heading',
                          titleUnderline &&
                            'underline underline-offset-[6px] decoration-paragraph/30',
                          titleClassName
                        )}
                      >
                        {title}
                      </h3>
                    )}
                    {subtitle && (
                      <span
                        className={cn(
                          'text-[11px] font-medium text-paragraph/70',
                          subtitleClassName
                        )}
                      >
                        {subtitle}
                      </span>
                    )}
                  </div>
                  {description && (
                    <p
                      className={cn(
                        'text-sm text-paragraph/70',
                        descriptionClassName
                      )}
                    >
                      {description}
                    </p>
                  )}
                </div>
                {action && (
                  <div className={cn('shrink-0', actionClassName)}>
                    {renderNode(action)}
                  </div>
                )}
              </header>
            )}

            {hasMetric && (
              <div className="flex flex-col gap-2">
                {label && (
                  <span
                    className={cn(
                      'text-[11px] font-semibold uppercase tracking-widest text-paragraph/70',
                      labelClassName
                    )}
                  >
                    {label}
                  </span>
                )}
                <div className="flex items-baseline justify-between gap-2">
                  {hasValue(value) && (
                    <span
                      className={cn(
                        'text-[26px] font-bold tracking-tight text-heading',
                        valueClassName
                      )}
                    >
                      {value}
                    </span>
                  )}
                  {meta && (
                    <div
                      className={cn(
                        'text-xs font-semibold text-paragraph',
                        metaClassName
                      )}
                    >
                      {renderNode(meta)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {hasValue(children) && (
              <div className={cn('p-0', contentClassName)}>{children}</div>
            )}

            {footer && (
              <footer className={cn('pt-4', footerClassName)}>
                {renderNode(footer)}
              </footer>
            )}
          </>
        )}
      </Component>
    );
  }
);
Card.displayName = 'Card';

export { Card };
