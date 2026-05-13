import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';

import { cn } from '@/utils/cn';

function DropdownMenu({ ...props }) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({ ...props }) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({ className, sideOffset = 8, align = 'end', variant = 'light', ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        data-variant={variant}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1.5 shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          variant === 'light' && 'border-stroke-divider bg-white text-paragraph',
          variant === 'dark' && 'border-stroke-divider bg-[#121733] text-heading shadow-2xl',
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({ className, inset, variant = 'default', menuVariant = 'light', ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      data-inset={inset}
      data-menu-variant={menuVariant}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-xs font-semibold outline-none transition data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset=true]:pl-8 data-[variant=destructive]:text-error data-[variant=destructive]:focus:bg-error/10',
        menuVariant === 'light' && 'focus:bg-primary/10',
        menuVariant === 'dark' && 'text-heading focus:bg-layer2',
        variant === 'default' && menuVariant === 'light' && 'text-primary',
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({ className, ...props }) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-stroke-divider', className)}
      {...props}
    />
  );
}

function DropdownMenuList({
  trigger,
  items,
  contentClassName,
  itemClassName,
  getItemClassName,
  renderItem,
  variant = 'light',
  align = 'end',
  side,
  sideOffset = 8,
  onItemSelect,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        variant={variant}
        className={contentClassName}
      >
        {items.map((item) => {
          if (item.hidden) return null;

          if (item.type === 'separator') {
            return <DropdownMenuSeparator key={item.id} className={item.className} />;
          }

          if (renderItem) {
            return renderItem({ item, variant });
          }

          return (
            <DropdownMenuItem
              key={item.id}
              disabled={item.disabled}
              variant={item.variant}
              menuVariant={variant}
              className={cn(
                itemClassName,
                typeof getItemClassName === 'function' && getItemClassName(item),
                item.className
              )}
              onSelect={(event) => {
                item.onSelect?.(event, item);
                onItemSelect?.(item, event);
              }}
            >
              {item.icon ? <item.icon className="h-4 w-4" /> : null}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuList,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
