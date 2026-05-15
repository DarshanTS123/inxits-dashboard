import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';
import { cn } from '@/utils/cn';

const AnnouncementItem = ({ title, date, type, typeColor }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:border-slate-600/50 transition-all group cursor-pointer">
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <Badge 
          variant="outline" 
          className={cn("text-[10px] uppercase font-bold py-0 h-5 border-none", typeColor)}
        >
          {type}
        </Badge>
        <span className="text-[11px] font-medium text-slate-500">{date}</span>
      </div>
      <h4 className="text-[14px] font-medium text-slate-300 group-hover:text-blue-400 transition-colors line-clamp-1">
        {title}
      </h4>
    </div>
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Edit announcement"
        className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Delete announcement"
        className="h-8 w-8 p-0 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </Button>
    </div>
  </div>
);

export const RegulatoryAnnouncements = ({ announcements = [], loading }) => {
  return (
    <Card
      className="h-full flex flex-col"
      padding="lg"
      title="Corporate & Regulatory announcements"
      headerClassName="pb-0"
      contentClassName="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pb-0"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="p-0 font-semibold uppercase text-blue-400 hover:bg-transparent hover:text-blue-300"
        >
          View all
        </Button>
      }
    >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-800/40 rounded-xl animate-pulse" />
          ))
        ) : (
          announcements.map((item) => (
            <AnnouncementItem 
              key={item.id}
              title={item.title}
              date={item.date}
              type={item.type}
              typeColor={
                item.type === 'Corporate' ? 'bg-blue-500/10 text-blue-400' :
                item.type === 'Regulatory' ? 'bg-amber-500/10 text-amber-400' :
                'bg-slate-500/10 text-slate-400'
              }
            />
          ))
        )}
    </Card>
  );
};
