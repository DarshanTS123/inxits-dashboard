import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@components/ui/Button/Button';
import { Input } from '@components/ui/Input/Input';
import { Select } from '@components/ui/Select/Select';
import { DataTable } from '@components/ui/Table/Table';
import {
  AVAILABLE_RMS,
  PASSWORD_HINT,
  RM_LEAD_ROLE,
  ROLE_OPTIONS,
  USER_OPTIONS,
} from '../constants/userFormConstants';

const passwordSchema = z
  .string()
  .trim()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[0-9]/, 'Password must include a number')
  .regex(/[^A-Za-z0-9]/, 'Password must include a symbol');

const userFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  userId: z
    .string()
    .trim()
    .min(1, 'User ID is required')
    .email('Enter a valid email address'),
  password: passwordSchema,
  assignRole: z.string().min(1, 'Assign role is required'),
  options: z.string().min(1, 'Options is required'),
});

const EMPTY_FORM_VALUES = {
  firstName: '',
  lastName: '',
  userId: '',
  password: '',
  assignRole: '',
  options: '',
};

const ActivateToggle = ({ id, checked, onChange, disabled }) => (
  <label
    htmlFor={id}
    className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center"
  >
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      disabled={disabled}
      className="peer sr-only"
    />
    <span className="absolute inset-0 rounded-full bg-white/10 transition-colors peer-checked:bg-primary peer-disabled:opacity-50" />
    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-heading shadow-sm transition-transform peer-checked:translate-x-4" />
  </label>
);

export const CreateUserForm = ({
  id,
  onSubmit,
  initialValues,
  initialAssignedRms = [],
  isSubmitting = false,
  isEditMode = false,
}) => {
  const [assignedRms, setAssignedRms] = useState(initialAssignedRms);
  const [selectedRmId, setSelectedRmId] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialValues ?? EMPTY_FORM_VALUES,
  });

  const submitting = isSubmitting || isFormSubmitting;

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  useEffect(() => {
    setAssignedRms(initialAssignedRms);
  }, [initialAssignedRms]);

  const assignRole = watch('assignRole');
  const showAssignRmSection = assignRole === RM_LEAD_ROLE;

  const availableRmOptions = useMemo(
    () =>
      AVAILABLE_RMS.filter(
        (rm) => !assignedRms.some((assigned) => assigned.id === rm.id)
      ).map((rm) => ({
        label: rm.userName,
        value: rm.id,
      })),
    [assignedRms]
  );

  const handleRmSelect = (rmId) => {
    if (!rmId) return;

    const rm = AVAILABLE_RMS.find((item) => item.id === rmId);
    if (!rm || assignedRms.some((assigned) => assigned.id === rm.id)) return;

    setAssignedRms((current) => [...current, { ...rm, isActive: true }]);
    setSelectedRmId('');
  };

  const handleToggleRmActive = useCallback((rmId, isActive) => {
    setAssignedRms((current) =>
      current.map((rm) => (rm.id === rmId ? { ...rm, isActive } : rm))
    );
  }, []);

  const handleRemoveRm = useCallback((rmId) => {
    setAssignedRms((current) => current.filter((rm) => rm.id !== rmId));
  }, []);

  const assignedRmColumns = useMemo(
    () => [
      {
        id: 'userName',
        header: 'User Name',
        accessorKey: 'userName',
        cellClassName: 'font-semibold text-heading',
      },
      {
        id: 'userId',
        header: 'User ID',
        accessorKey: 'userId',
        cellClassName: 'text-paragraph/90',
      },
      {
        id: 'actions',
        header: 'Actions',
        className: isEditMode ? 'min-w-[220px]' : 'min-w-[120px]',
        cellClassName: 'whitespace-nowrap',
        cell: ({ row }) => (
          <div className="flex items-center gap-3 whitespace-nowrap">
            {isEditMode && (
              <>
                <div className="flex items-center gap-2">
                  <ActivateToggle
                    id={`activate-rm-${row.id}`}
                    checked={row.isActive ?? true}
                    onChange={(isActive) => handleToggleRmActive(row.id, isActive)}
                    disabled={submitting}
                  />
                  <span className="text-sm font-medium text-heading">Activate</span>
                </div>
                <span
                  aria-hidden="true"
                  className="h-4 w-px shrink-0 bg-stroke-divider"
                />
              </>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={X}
              className="inline-flex h-auto shrink-0 flex-nowrap items-center gap-1.5 whitespace-nowrap px-0 text-error hover:bg-transparent hover:text-error/80 [&_span]:whitespace-nowrap [&_svg]:shrink-0 [&_svg]:text-error"
              onClick={() => handleRemoveRm(row.id)}
            >
              Remove
            </Button>
          </div>
        ),
      },
    ],
    [handleRemoveRm, handleToggleRmActive, isEditMode, submitting]
  );

  const handleFormSubmit = async (data) => {
    await onSubmit({
      ...data,
      assignedRms: showAssignRmSection ? assignedRms : [],
    });
  };

  return (
    <form id={id} className="space-y-5" onSubmit={handleSubmit(handleFormSubmit)}>
      <section className="rounded-xl border border-stroke-divider bg-layer1 p-4 sm:p-6">
        <h2 className="mb-5 text-lg font-semibold text-subheading sm:mb-6">
          User Details
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-user-first-name"
              className="px-1 text-xs font-medium text-text-label"
            >
              First Name <span className="text-error">*</span>
            </label>
            <Input
              id="create-user-first-name"
              required
              placeholder="Enter first name"
              error={errors.firstName?.message}
              disabled={submitting}
              {...register('firstName')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-user-last-name"
              className="px-1 text-xs font-medium text-text-label"
            >
              Last Name <span className="text-error">*</span>
            </label>
            <Input
              id="create-user-last-name"
              required
              placeholder="Enter last name"
              error={errors.lastName?.message}
              disabled={submitting}
              {...register('lastName')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-user-id"
              className="px-1 text-xs font-medium text-text-label"
            >
              User ID <span className="text-error">*</span>
            </label>
            <Input
              id="create-user-id"
              type="email"
              required
              placeholder="Enter user ID"
              error={errors.userId?.message}
              disabled={submitting}
              {...register('userId')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-user-password"
              className="px-1 text-xs font-medium text-text-label"
            >
              Password <span className="text-error">*</span>
            </label>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
              <Input
                id="create-user-password"
                type="password"
                required
                placeholder="Enter password"
                error={errors.password?.message}
                disabled={submitting}
                containerClassName="lg:flex-1"
                {...register('password')}
              />
              <p className="px-1 text-xs italic leading-5 text-paragraph/70 lg:max-w-[280px]">
                {PASSWORD_HINT}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-user-assign-role"
              className="px-1 text-xs font-medium text-text-label"
            >
              Assign Role <span className="text-error">*</span>
            </label>
            <Controller
              name="assignRole"
              control={control}
              render={({ field }) => (
                <Select
                  id="create-user-assign-role"
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  placeholder="Select role"
                  options={ROLE_OPTIONS}
                  triggerClassName="h-12 rounded-xl bg-transparent text-sm"
                />
              )}
            />
            {errors.assignRole?.message && (
              <span className="px-1 text-[11px] font-medium text-error">
                {errors.assignRole.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-user-options"
              className="px-1 text-xs font-medium text-text-label"
            >
              Options <span className="text-error">*</span>
            </label>
            <Controller
              name="options"
              control={control}
              render={({ field }) => (
                <Select
                  id="create-user-options"
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  placeholder="Select option"
                  options={USER_OPTIONS}
                  triggerClassName="h-12 rounded-xl bg-transparent text-sm"
                />
              )}
            />
            {errors.options?.message && (
              <span className="px-1 text-[11px] font-medium text-error">
                {errors.options.message}
              </span>
            )}
          </div>
        </div>
      </section>

      {showAssignRmSection && (
        <section className="rounded-xl border border-stroke-divider bg-layer1 p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-subheading">Assign RM</h2>
            <p className="text-sm font-medium text-paragraph">
              No. of RM assigned :{' '}
              <span className="font-semibold text-heading">
                {assignedRms.length}
              </span>
            </p>
          </div>

          <div className="mb-5 max-w-md">
            <label
              htmlFor="create-user-select-rm"
              className="mb-1.5 block px-1 text-xs font-medium text-text-label"
            >
              Select RM
            </label>
            <Select
              id="create-user-select-rm"
              value={selectedRmId || undefined}
              onValueChange={handleRmSelect}
              placeholder="Select RM"
              options={availableRmOptions}
              triggerClassName="h-12 rounded-xl bg-transparent text-sm"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-stroke-divider">
            <DataTable
              columns={assignedRmColumns}
              data={assignedRms}
              getRowKey={(row) => row.id}
              emptyMessage="No relationship managers assigned yet."
            />
          </div>
        </section>
      )}
    </form>
  );
};
