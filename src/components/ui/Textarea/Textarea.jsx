import React, { useId } from 'react';
import { cn } from '@/utils/cn';

const textareaSizes = {
  sm: 'min-h-[120px]',
  lg: 'min-h-24',
};

export const Textarea = React.forwardRef(({
  label,
  error,
  helperText,
  size = 'lg',
  className,
  textareaClassName,
  labelClassName,
  containerClassName,
  disabled,
  required,
  id: providedId,
  rows = 4,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const isError = !!error;
  const errorMessage = typeof error === 'string' ? error : null;

  const ariaDescribedBy = [
    isError ? errorId : null,
    helperText ? helperId : null,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col w-full gap-1.5', containerClassName || className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'px-1 text-xs font-medium text-text-label',
            disabled && 'text-text-disabled',
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}

      <div
        className={cn(
          'rounded-xl border bg-transparent transition-all duration-200',
          'border-stroke-divider hover:border-white/40',
          'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20',
          isError && 'border-error hover:border-error/80 focus-within:border-error focus-within:ring-error/20',
          disabled && 'opacity-50 cursor-not-allowed',
          textareaSizes[size] || textareaSizes.lg
        )}
      >
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={isError}
          aria-describedby={ariaDescribedBy}
          className={cn(
            'w-full resize-none border-0 bg-transparent px-4 py-3 text-sm font-medium outline-none transition-all duration-200',
            'placeholder:text-text-placeholder text-heading',
            'focus:ring-0 focus-visible:outline-none',
            isError && 'focus:ring-error/20',
            textareaClassName
          )}
          {...props}
        />
      </div>

      {(isError || helperText) && (
        <div className="flex flex-col gap-0.5 px-1">
          {isError && errorMessage && (
            <span
              id={errorId}
              className="text-[11px] font-medium text-error animate-in fade-in slide-in-from-top-1"
            >
              {errorMessage}
            </span>
          )}
          {helperText && !isError && (
            <span
              id={helperId}
              className="text-[11px] font-medium text-text-label/60"
            >
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
