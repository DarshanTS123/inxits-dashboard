import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '@/utils/cn';

const listClass =
  'inline-flex items-center gap-3 border-b border-transparent';

const triggerClass =
  'inline-flex items-center gap-2 border-b-2 border-transparent px-1 py-2 text-sm font-semibold text-paragraph transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=active]:border-primary data-[state=active]:text-primary [&_[data-slot=tabs-badge]]:inline-flex [&_[data-slot=tabs-badge]]:h-5 [&_[data-slot=tabs-badge]]:min-w-5 [&_[data-slot=tabs-badge]]:items-center [&_[data-slot=tabs-badge]]:justify-center [&_[data-slot=tabs-badge]]:rounded-full [&_[data-slot=tabs-badge]]:border [&_[data-slot=tabs-badge]]:border-stroke-divider [&_[data-slot=tabs-badge]]:bg-layer2 [&_[data-slot=tabs-badge]]:px-1.5 [&_[data-slot=tabs-badge]]:text-[11px] [&_[data-slot=tabs-badge]]:font-semibold [&_[data-slot=tabs-badge]]:leading-none [&_[data-slot=tabs-badge]]:text-paragraph/80 data-[state=active]:[&_[data-slot=tabs-badge]]:border-primary/35 data-[state=active]:[&_[data-slot=tabs-badge]]:bg-primary/20 data-[state=active]:[&_[data-slot=tabs-badge]]:text-primary';

const contentClass = 'outline-none';

const renderTabLabel = (label) => {
  if (typeof label === 'string') {
    return <span className="text-sm font-semibold">{label}</span>;
  }

  return label;
};

/**
 * @typedef {Object} TabItem
 * @property {string} value
 * @property {import('react').ReactNode} label
 * @property {import('react').ReactNode} [content]
 * @property {import('react').ReactNode} [badge]
 * @property {boolean} [disabled]
 * @property {string} [contentClassName]
 */

/**
 * Data-driven tabs. Pass an `items` array from the parent.
 */
function Tabs({
  items = [],
  children,
  listClassName,
  contentClassName,
  defaultValue,
  ...rootProps
}) {
  const resolvedDefault = defaultValue ?? items[0]?.value;
  const hasPerItemContent = items.some((item) => item.content != null);
  const sharedContent = children;

  if (!items.length) {
    return null;
  }

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      defaultValue={resolvedDefault}
      {...rootProps}
    >
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(listClass, listClassName)}
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            data-slot="tabs-trigger"
            value={item.value}
            disabled={item.disabled}
            className={triggerClass}
          >
            {renderTabLabel(item.label)}
            {item.badge != null && (
              <span data-slot="tabs-badge">{item.badge}</span>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {hasPerItemContent &&
        items.map(
          (item) =>
            item.content != null && (
              <TabsPrimitive.Content
                key={item.value}
                data-slot="tabs-content"
                value={item.value}
                className={cn(contentClass, contentClassName, item.contentClassName)}
              >
                {item.content}
              </TabsPrimitive.Content>
            )
        )}

      {!hasPerItemContent &&
        sharedContent != null &&
        items.map((item) => (
          <TabsPrimitive.Content
            key={item.value}
            data-slot="tabs-content"
            value={item.value}
            className={cn(contentClass, contentClassName, item.contentClassName)}
          >
            {sharedContent}
          </TabsPrimitive.Content>
        ))}
    </TabsPrimitive.Root>
  );
}

export { Tabs };
