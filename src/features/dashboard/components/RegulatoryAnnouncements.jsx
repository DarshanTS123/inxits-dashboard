import { useState } from 'react';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui/Card/Card';
import { Drawer } from '@/components/ui/Drawer/Drawer';
import { cn } from '@/utils/cn';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { RegulatoryAnnouncementForm } from './RegulatoryAnnouncementForm';

const AnnouncementItem = ({ title, date, type, typeColor, index, onEdit }) => (
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
          onClick={onEdit}
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

export const RegulatoryAnnouncements = ({
  announcements = [],
  loading,
  height = 400,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setSelectedAnnouncement(null);
    setFormError(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormError(null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = (nextOpen) => {
    if (!nextOpen) {
      setIsDrawerOpen(false);
      setSelectedAnnouncement(null);
      setFormError(null);
    }
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await selectedAnnouncement
      //   ? updateAnnouncement(selectedAnnouncement.id, data)
      //   : createAnnouncement(data);
      
      console.log('Form submitted:', data, 'Mode:', selectedAnnouncement ? 'edit' : 'add');
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      handleCloseDrawer(false);
    } catch (error) {
      setFormError(error?.message || 'Failed to save announcement');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Card
        hoverable
        padding="md"
        title="Regulatory Announcements"
        className="flex h-full flex-col"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        headerClassName="items-center"
        contentClassName="flex min-h-0 flex-1 flex-col overflow-y-auto custom-scrollbar"
        action={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="p-0 text-[11px] font-semibold uppercase tracking-wide text-blue-400 hover:bg-transparent hover:text-blue-300"
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
                onEdit={() => handleOpenEdit(item)}
              />
            ))}
            <div className="mt-auto">
              <Button
                variant="outline"
                leftIcon={Plus}
                size="lg"
                className="w-full"
                onClick={handleOpenAdd}
              >
                Add
              </Button>
            </div>
          </>
        )}
      </Card>

      <Drawer
        open={isDrawerOpen}
        onOpenChange={handleCloseDrawer}
        title={selectedAnnouncement ? 'Edit Announcement' : 'Add Regulatory Announcement'}
        size="lg"
        footer={
          <Button
            type="submit"
            form="announcement-form"
            className="h-11 w-full sm:w-auto"
            isLoading={isSubmitting}
          >
            Save
          </Button>
        }
      >
        <div className="rounded-xl bg-layer1 p-4 sm:p-6">
          <RegulatoryAnnouncementForm
            onSubmit={handleFormSubmit}
            initialData={
              selectedAnnouncement
                ? {
                    name: selectedAnnouncement.title,
                    tag: selectedAnnouncement.type,
                    link: selectedAnnouncement.link || '',
                    description: selectedAnnouncement.description || '',
                  }
                : null
            }
            error={formError}
            isSubmitting={isSubmitting}
          />
        </div>
      </Drawer>
    </>
  );
};
