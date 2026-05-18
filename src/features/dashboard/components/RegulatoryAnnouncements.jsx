import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';
import { cn } from '@/utils/cn';
import { Pencil, Trash2, Plus } from 'lucide-react';

const AnnouncementItem = ({ title, date, type, typeColor, index }) => (
  <div
    className={cn(
      'flex items-center justify-between p-4 transition-all group cursor-pointer',
      index % 2 === 0 ? 'bg-slate-800/40' : 'bg-transparent'
    )}
  >
    <div className="flex flex-col gap-1.5">
      <h4 className="text-[14px] font-medium text-blue-400 group-hover:text-blue-300 transition-colors line-clamp-1">
        {title}
      </h4>
      <span className="text-[12px] italic text-slate-400">{date}</span>
    </div>
    <div className="flex items-center gap-3">
      <Badge
        variant="outline"
        className={cn(
          'text-[11px] font-medium py-1 px-3 border-none',
          typeColor
        )}
      >
        {type}
      </Badge>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Edit announcement"
          leftIcon={Pencil}
          className="h-8 w-8 p-0 bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:text-slate-100 rounded-md"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Delete announcement"
          leftIcon={Trash2}
          className="h-8 w-8 p-0 bg-red-900/30 text-red-300 hover:bg-red-900/50 hover:text-red-200 rounded-md"
        />
      </div>
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
      contentClassName="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-0"
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
          <div
            key={i}
            className="h-20 bg-slate-800/40 rounded-xl animate-pulse"
          />
        ))
      ) : (
        <>
          {announcements.map((item, index) => (
            <AnnouncementItem
              key={item.id}
              index={index}
              title={item.title}
              date={item.date}
              type={item.type}
              typeColor="bg-blue-900/40 text-blue-200"
            />
          ))}
          <div className="mt-auto">
            <Button variant="outline" leftIcon={Plus} size="lg" className="w-full">
              Add
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};
