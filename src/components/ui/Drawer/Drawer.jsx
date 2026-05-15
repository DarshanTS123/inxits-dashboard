import { X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { Button } from '@/components/ui/Button/Button';
import { cn } from '@/utils/cn';

function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  headerAction,
  className,
  contentClassName,
  footerClassName,
  side = 'right',
  size = 'lg',
  closeLabel = 'Close drawer',
  ...props
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-40 bg-black/45 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0'
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed z-50 flex max-h-screen flex-col overflow-hidden bg-page text-heading shadow-2xl outline-none',
            'focus-visible:ring-2 focus-visible:ring-primary/30',
            sideClasses[side],
            sizeClasses[size],
            animationClasses[side],
            className
          )}
        >
          <div className="flex h-16 items-center justify-between gap-3 border-b border-stroke-divider bg-[#151827] px-4 sm:gap-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <DialogPrimitive.Title className="truncate text-xl font-bold text-heading">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="mt-2 text-sm font-medium text-paragraph">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              {headerAction}
              <DialogPrimitive.Close asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  aria-label={closeLabel}
                  className="h-10 w-10 rounded-md p-0 text-icon-active hover:bg-white/10 sm:h-11 sm:w-11"
                >
                  <X className="h-6 w-6 sm:h-8 sm:w-8" />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </div>

          <div
            className={cn(
              'custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6',
              contentClassName
            )}
          >
            {children}
          </div>

          {footer && (
            <div
              className={cn(
                'flex min-h-16 shrink-0 flex-col-reverse gap-3 border-t border-stroke-divider bg-[#151827] px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-end sm:px-6 sm:py-0 lg:px-8',
                footerClassName
              )}
            >
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const sideClasses = {
  right:
    'inset-y-0 right-0 h-full w-full sm:h-[calc(100%-2px)] sm:rounded-l-[20px]',
  left:
    'inset-y-0 left-0 h-full w-full sm:h-[calc(100%-2px)] sm:rounded-r-[20px]',
  bottom: 'inset-x-0 bottom-0 h-[90vh] w-full rounded-t-xl',
};

const sizeClasses = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-2xl',
  lg: 'sm:max-w-4xl',
  xl: 'sm:max-w-4xl xl:max-w-6xl',
  full: 'max-w-none',
};

const animationClasses = {
  right:
    'data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
  left:
    'data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left',
  bottom:
    'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom',
};

export { Drawer };
