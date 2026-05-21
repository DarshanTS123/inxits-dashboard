import { X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { Button } from '@/components/ui/Button/Button';
import { cn } from '@/utils/cn';

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  contentClassName,
  size = 'md', // sm | md | lg | full
  closeLabel = 'Close modal',
  ...props
}) {
  const sizeClasses = {
    sm: 'sm:max-w-sm h-fit max-h-[80vh] overflow-y-auto',
    md: 'sm:max-w-md h-fit max-h-[80vh] overflow-y-auto',
    lg: 'sm:max-w-xl h-fit max-h-[80vh] overflow-y-auto',
    full: 'max-w-none w-full h-full',
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/45 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0'
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-0 z-50 m-auto flex max-w-full flex-col overflow-hidden rounded-lg bg-page text-heading shadow-2xl outline-none',
            'focus-visible:ring-2 focus-visible:ring-primary/30',
            sizeClasses[size],
            className
          )}
        >
           {/* Close button at top right */}
           <DialogPrimitive.Close asChild>
             <Button
               type="button"
               variant="ghost"
               size="icon"
               aria-label={closeLabel}
               className="absolute top-4 right-4 h-10 w-10 rounded-md p-0 text-icon-active hover:bg-white/10"
             >
               <X className="h-5 w-5" />
             </Button>
           </DialogPrimitive.Close>
           {/* Content */}
           <div className={cn('flex-1 overflow-y-auto p-6', contentClassName)}>
             {children}
           </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
