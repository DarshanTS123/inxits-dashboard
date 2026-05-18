import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { AlertCircle } from 'lucide-react';

const regulatoryAnnouncementSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(200, 'Name must be less than 200 characters'),
  tag: z
    .string()
    .trim()
    .min(2, 'Tag must be at least 2 characters')
    .max(50, 'Tag must be less than 50 characters'),
  link: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => value === '' || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value),
      {
        message: 'Please enter a valid URL',
      }
    ),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be less than 1000 characters'),
});

export const RegulatoryAnnouncementForm = ({
  onSubmit,
  initialData = null,
  error = null,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(regulatoryAnnouncementSchema),
    mode: 'onBlur',
    defaultValues: initialData || {
      name: '',
      tag: '',
      link: '',
      description: '',
    },
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
  };

  return (
    <form id="announcement-form" onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Error banner */}
      {error && (
        <div className="mb-5 flex items-center gap-3 border border-error/20 bg-error/10 px-4 py-3 rounded-xl">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-error" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Form section header */}
      <h2 className="mb-5 text-lg font-semibold text-subheading sm:mb-6">
        Announcement Details
      </h2>

      {/* Form fields in a grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Name field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="announcement-name"
            className="px-1 text-xs font-medium text-text-label"
          >
            Name <span className="text-error">*</span>
          </label>
          <Input
            id="announcement-name"
            type="text"
            placeholder="Board Approves Quarterly Dividend"
            {...register('name')}
            error={errors.name?.message}
            disabled={isSubmitting}
          />
        </div>

        {/* Tag field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="announcement-tag"
            className="px-1 text-xs font-medium text-text-label"
          >
            Tag <span className="text-error">*</span>
          </label>
          <Input
            id="announcement-tag"
            type="text"
            placeholder="Corporate Action"
            {...register('tag')}
            error={errors.tag?.message}
            disabled={isSubmitting}
          />
        </div>

        {/* Add Link field - full width */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label
            htmlFor="announcement-link"
            className="px-1 text-xs font-medium text-text-label"
          >
            Add Link
          </label>
          <Input
            id="announcement-link"
            type="url"
            placeholder="https://article1234.com/"
            {...register('link')}
            error={errors.link?.message}
            disabled={isSubmitting}
          />
        </div>

        {/* Description field - full width */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label
            htmlFor="announcement-description"
            className="px-1 text-xs font-medium text-text-label"
          >
            Description
          </label>
          <Textarea
            id="announcement-description"
            placeholder="Enter Description"
            rows={5}
            {...register('description')}
            error={errors.description?.message}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};
