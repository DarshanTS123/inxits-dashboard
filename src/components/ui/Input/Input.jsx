import React, { useId } from 'react';
import { cn } from '../../../utils/cn';

const inputSizes = {
  sm: {
    padding: 'py-2 px-3',
    icon: 'h-4 w-4',
    labelOffset: '-top-2',
  },
  lg: {
    padding: 'py-3.5 px-4',
    icon: 'h-5 w-5',
    labelOffset: '-top-2.5',
  },
};


export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  size = 'lg',
  className,
  inputClassName,
  labelClassName,
  containerClassName,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  required,
  id: providedId,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  
  const config = inputSizes[size] || inputSizes.lg;
  const isError = !!error;
  const errorMessage = typeof error === 'string' ? error : null;

  // Determine aria-describedby based on state
  const ariaDescribedBy = [
    isError ? errorId : null,
    helperText ? helperId : null
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col w-full gap-1.5', containerClassName || className)}>
      <div className="relative group w-full">
        {/* Border & Background Container */}
        <div 
          className={cn(
            'relative flex items-center transition-all duration-200 rounded-xl border',
            'bg-transparent w-full',
            // Default/Enabled State
            'border-stroke-divider hover:border-white/40',
            // Focused State
            'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20',
            // Error State
            isError && 'border-error hover:border-error/80 focus-within:border-error focus-within:ring-error/20',
            // Disabled State
            disabled && 'opacity-50 grayscale cursor-not-allowed border-outline-disabled bg-layer1/20',
          )}
        >
          {/* Floating Label */}
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'absolute left-3 font-medium transition-all duration-200 pointer-events-none z-10',
                'bg-page text-[12px] px-1 leading-none',
                config.labelOffset,
                'text-text-label',
                // Interactive colors
                'group-focus-within:text-primary',
                isError && 'text-error group-focus-within:text-error',
                disabled && 'text-text-disabled group-focus-within:text-text-disabled',
                labelClassName
              )}
            >
              {label}
              {required && <span className="ml-0.5 text-error">*</span>}
            </label>
          )}

          {/* Content Wrapper (handles padding and icon spacing) */}
          <div className={cn('flex items-center w-full min-h-full', config.padding)}>
            {/* Left Icon */}
            {LeftIcon && (
              <div 
                className={cn(
                  'mr-2.5 transition-colors flex-shrink-0',
                  isError ? 'text-error' : 'text-text-label group-focus-within:text-primary'
                )}
              >
                <LeftIcon className={config.icon} />
              </div>
            )}

            {/* Actual Input */}
            <input
              ref={ref}
              id={id}
              disabled={disabled}
              required={required}
              aria-invalid={isError}
              aria-describedby={ariaDescribedBy}
              className={cn(
                'w-full bg-transparent border-none outline-none focus:ring-0 p-0',
                'text-heading text-sm font-medium placeholder:text-paragraph/40 placeholder:font-normal',
                'disabled:cursor-not-allowed disabled:text-text-disabled',
                inputClassName
              )}
              {...props}
            />

            {/* Right Icon */}
            {RightIcon && (
              <div 
                className={cn(
                  'ml-2.5 transition-colors flex-shrink-0',
                  isError ? 'text-error' : 'text-text-label group-focus-within:text-primary'
                )}
              >
                <RightIcon className={config.icon} />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Footer Info (Error Message or Helper Text) */}
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

Input.displayName = 'Input';

