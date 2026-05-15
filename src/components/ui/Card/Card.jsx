import React from 'react';
import { cn } from '@/utils/cn';

const cardVariants = {
  default: "border-slate-700/60 bg-[#0d1526]",
  muted: "border-slate-700/50 bg-[#111827]",
  elevated: "border-slate-700/60 bg-[#0d1526] shadow-2xl shadow-black/20",
};

const cardPaddings = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

const skeletonWidths = {
  sm: "w-16",
  md: "w-24",
  lg: "w-36",
  full: "w-full",
};

const hasValue = (value) => value !== undefined && value !== null && value !== false;

const renderNode = (node, fallbackProps = {}) => {
  if (typeof node === 'function') {
    return node(fallbackProps);
  }

  return node;
};

const CardSkeleton = ({ rows = 3 }) => (
  <div className="animate-pulse space-y-4">
    <div className="h-5 w-40 rounded bg-slate-800" />
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-4 rounded bg-slate-800",
            skeletonWidths[index === rows - 1 ? 'md' : 'full']
          )}
        />
      ))}
    </div>
  </div>
);

const CardEmptyState = ({ emptyIcon, emptyTitle = "No data available", emptyDescription }) => (
  <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-center text-slate-500">
    {emptyIcon && <div className="text-slate-500">{emptyIcon}</div>}
    <p className="text-sm font-medium text-slate-400">{emptyTitle}</p>
    {emptyDescription && (
      <p className="max-w-sm text-xs leading-5 text-slate-500">{emptyDescription}</p>
    )}
  </div>
);

const Card = React.forwardRef(({
  className,
  children,
  title,
  subtitle,
  description,
  action,
  actions,
  footer,
  content,
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
  variant = "default",
  padding = "none",
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
}, ref) => {
  const headerAction = actions || action;
  const hasHeader = hasValue(title) || hasValue(subtitle) || hasValue(description) || hasValue(headerAction);
  const hasMetric = hasValue(label) || hasValue(value) || hasValue(meta);
  const body = children ?? content;

  return (
    <Component
      ref={ref}
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-2xl border shadow-xl transition-all",
        cardVariants[variant] || cardVariants.default,
        cardPaddings[padding] || padding,
        hoverable && "hover:border-slate-600/80",
        interactive && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50",
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
            <CardHeader
              className={cn(
                "flex-row items-start justify-between gap-4 space-y-0 p-0",
                body && "mb-4",
                headerClassName
              )}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  {title && (
                    <CardTitle underline={titleUnderline} className={titleClassName}>
                      {title}
                    </CardTitle>
                  )}
                  {subtitle && (
                    <span className={cn("text-[11px] font-medium text-slate-500", subtitleClassName)}>
                      {subtitle}
                    </span>
                  )}
                </div>
                {description && (
                  <CardDescription className={descriptionClassName}>
                    {description}
                  </CardDescription>
                )}
              </div>
              {headerAction && (
                <div className={cn("shrink-0", actionClassName)}>
                  {renderNode(headerAction)}
                </div>
              )}
            </CardHeader>
          )}

          {hasMetric && (
            <div className="flex flex-col gap-2">
              {label && (
                <span className={cn("text-[11px] font-semibold uppercase tracking-widest text-slate-500", labelClassName)}>
                  {label}
                </span>
              )}
              <div className="flex items-baseline justify-between gap-2">
                {hasValue(value) && (
                  <span className={cn("text-[26px] font-bold tracking-tight text-slate-100", valueClassName)}>
                    {value}
                  </span>
                )}
                {meta && (
                  <div className={cn("text-xs font-semibold text-slate-400", metaClassName)}>
                    {renderNode(meta)}
                  </div>
                )}
              </div>
            </div>
          )}

          {hasValue(body) && <CardContent className={cn("p-0", contentClassName)}>{body}</CardContent>}

          {footer && (
            <CardFooter className={cn("p-0 pt-4", footerClassName)}>
              {renderNode(footer)}
            </CardFooter>
          )}
        </>
      )}
    </Component>
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, children, underline = true, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-[17px] font-medium text-slate-300 tracking-tight",
      underline && "underline underline-offset-[6px] decoration-slate-400/30",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
