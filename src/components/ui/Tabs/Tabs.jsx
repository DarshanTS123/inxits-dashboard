import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '@/utils/cn';

function Tabs(props) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex items-center gap-3 border-b border-transparent',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'inline-flex items-center gap-2 border-b-2 border-transparent px-1 py-2 text-sm font-semibold text-paragraph transition-colors',
        'hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'data-[state=active]:border-primary data-[state=active]:text-primary',
        '[&_[data-slot=tabs-badge]]:inline-flex [&_[data-slot=tabs-badge]]:h-5 [&_[data-slot=tabs-badge]]:min-w-5 [&_[data-slot=tabs-badge]]:items-center [&_[data-slot=tabs-badge]]:justify-center',
        '[&_[data-slot=tabs-badge]]:rounded-full [&_[data-slot=tabs-badge]]:border [&_[data-slot=tabs-badge]]:border-stroke-divider [&_[data-slot=tabs-badge]]:bg-layer2',
        '[&_[data-slot=tabs-badge]]:px-1.5 [&_[data-slot=tabs-badge]]:text-[11px] [&_[data-slot=tabs-badge]]:font-semibold [&_[data-slot=tabs-badge]]:leading-none [&_[data-slot=tabs-badge]]:text-paragraph/80',
        'data-[state=active]:[&_[data-slot=tabs-badge]]:border-primary/35 data-[state=active]:[&_[data-slot=tabs-badge]]:bg-primary/20 data-[state=active]:[&_[data-slot=tabs-badge]]:text-primary',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
