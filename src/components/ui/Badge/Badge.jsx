import { cn } from '@/utils/cn';

const Badge = ({ children, className, variant = "default", ...props }) => {
  const variants = {
    default: "bg-slate-800 text-slate-100",
    outline: "border border-slate-700 text-slate-300",
    success: "bg-green-500/10 text-green-400 border border-green-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
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
