import React from 'react';
import { cn } from '../../../utils/cn';

const variants = {
  primary: 'bg-primary text-text-on-primary hover:opacity-90 active:scale-[0.98]',
  secondary: 'bg-layer2 text-text-enabled hover:bg-white/10 active:scale-[0.98]',
  outline: 'border border-stroke-divider bg-transparent text-text-heading hover:bg-white/5 active:scale-[0.98]',
  ghost: 'bg-transparent text-paragraph hover:bg-layer1 hover:text-text-heading',
  danger: 'bg-error text-white hover:opacity-90 active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale disabled:scale-100',
        
        // Variant & Size
        variants[variant],
        sizes[size],
        
        // Custom classes
        className
      )}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      {/* Left Icon */}
      {!isLoading && LeftIcon && <LeftIcon className="h-4 w-4" />}

      {/* Button Text */}
      {children && <span>{children}</span>}

      {/* Right Icon */}
      {!isLoading && RightIcon && <RightIcon className="h-4 w-4" />}
    </button>
  );
});

Button.displayName = 'Button';
