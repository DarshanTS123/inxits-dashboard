import { cn } from '@/utils/cn';

const Badge = ({ children, className, variant = "default", ...props }) => {
  const variants = {
    default: "bg-layer2 text-heading",
    outline: "border border-stroke-divider text-subheading",
    success: "bg-success/10 text-success border border-success/25",
    warning: "bg-warning/10 text-warning border border-warning/25",
    danger: "bg-error/10 text-error border border-error/25",
    info: "bg-info/10 text-info border border-info/25",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };
