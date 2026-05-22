import { Toaster as SonnerToaster } from 'sonner';
import {
  AlertTriangle,
  Check,
  Info,
  Loader2,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const toastVariants = {
  success: 'bg-success',
  error: 'bg-error',
  warning: 'bg-warning',
  info: 'bg-info',
};

function ToastStatusIcon({ variant, children }) {
  return (
    <span
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
        toastVariants[variant],
      )}
    >
      {children}
    </span>
  );
}

const toastClassNames = {
  toast: cn(
    'flex w-[356px] max-w-[calc(100vw-2rem)] items-center gap-3',
    'rounded-2xl border border-white/10 bg-popup px-4 py-3',
    'shadow-none',
  ),
  title: 'text-sm font-semibold leading-snug text-heading',
  description: 'text-xs leading-snug text-subheading',
  content: 'flex min-w-0 flex-1 flex-col gap-0.5',
  icon: 'shrink-0',
  closeButton: cn(
    'static order-last ml-auto shrink-0',
    'flex h-5 w-5 items-center justify-center rounded-none border-0 bg-transparent p-0',
    'text-icon-active opacity-80 transition-opacity hover:opacity-100',
  ),
};

const toastIcons = {
  success: (
    <ToastStatusIcon variant="success">
      <Check className="h-3 w-3 text-white" strokeWidth={3} />
    </ToastStatusIcon>
  ),
  error: (
    <ToastStatusIcon variant="error">
      <X className="h-3 w-3 text-white" strokeWidth={3} />
    </ToastStatusIcon>
  ),
  warning: (
    <ToastStatusIcon variant="warning">
      <AlertTriangle className="h-3 w-3 text-white" strokeWidth={3} />
    </ToastStatusIcon>
  ),
  info: (
    <ToastStatusIcon variant="info">
      <Info className="h-3 w-3 text-white" strokeWidth={3} />
    </ToastStatusIcon>
  ),
  loading: <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />,
  close: <X className="h-4 w-4" strokeWidth={2} />,
};

export function Toaster(props) {
  return (
    <SonnerToaster
      position="top-right"
      theme="dark"
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: toastClassNames,
      }}
      icons={toastIcons}
      {...props}
    />
  );
}
