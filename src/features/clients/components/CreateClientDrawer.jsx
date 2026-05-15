import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@components/ui/Button/Button';
import { Drawer } from '@components/ui/Drawer/Drawer';
import { Input } from '@components/ui/Input/Input';
import { Select } from '@components/ui/Select/Select';

const RM_OPTIONS = [
  { label: 'Select rm', value: 'unassigned' },
  { label: 'Aarav Shah', value: 'aarav-shah' },
  { label: 'Kavya Mehta', value: 'kavya-mehta' },
  { label: 'Rohan Iyer', value: 'rohan-iyer' },
];

const createClientSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email ID is required')
    .email('Enter a valid email ID'),
  mobileNumber: z
    .string()
    .trim()
    .min(1, 'Mobile number is required')
    .regex(/^[0-9]{10}$/, 'Enter a valid 10 digit mobile number'),
  rm: z.string(),
});

export const CreateClientDrawer = ({ open, onOpenChange }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      rm: 'unassigned',
    },
  });

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      reset();
    }

    onOpenChange(nextOpen);
  };

  const onSubmit = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      title="Create New Client"
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full sm:w-auto"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-client-form"
            className="h-11 w-full sm:w-auto"
            isLoading={isSubmitting}
          >
            Send Invite link
          </Button>
        </>
      }
    >
      <form
        id="create-client-form"
        className="rounded-xl bg-layer1 p-4 sm:p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="mb-5 text-lg font-semibold text-subheading sm:mb-6">
          Client Details
        </h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-client-full-name"
              className="px-1 text-xs font-medium text-text-label"
            >
              Full Name <span className="text-error">*</span>
            </label>
            <Input
              id="create-client-full-name"
              required
              placeholder="Enter full name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-client-email"
              className="px-1 text-xs font-medium text-text-label"
            >
              Email ID <span className="text-error">*</span>
            </label>
            <Input
              id="create-client-email"
              type="email"
              required
              placeholder="Enter email ID"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-client-mobile-number"
              className="px-1 text-xs font-medium text-text-label"
            >
              Mobile Number <span className="text-error">*</span>
            </label>
            <Input
              id="create-client-mobile-number"
              required
              placeholder="Enter mobile number"
              error={errors.mobileNumber?.message}
              {...register('mobileNumber')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-client-rm"
              className="px-1 text-xs font-medium text-text-label"
            >
              Assign RM
            </label>
            <Controller
              name="rm"
              control={control}
              render={({ field }) => (
                <Select
                  id="create-client-rm"
                  value={field.value}
                  onValueChange={field.onChange}
                  options={RM_OPTIONS}
                  triggerClassName="h-12 rounded-xl bg-transparent text-sm"
                />
              )}
            />
          </div>
        </div>
      </form>
    </Drawer>
  );
};
