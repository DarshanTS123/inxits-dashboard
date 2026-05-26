import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageLoader } from '@components/ui/PageLoader';
import { Breadcrumbs } from '@components/ui/Breadcrumbs/Breadcrumbs';
import { Button } from '@components/ui/Button/Button';

import {
  getUserFormState,
  useCreateUser,
  useUpdateUser,
  useUser,
} from './api/userManagement';
import { CreateUserForm } from './components/CreateUserForm';

const USER_FORM_ID = 'user-form';

export const CreateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { data: user, isLoading, isError } = useUser(id);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const formState = useMemo(
    () => (isEditMode && user ? getUserFormState(user) : null),
    [isEditMode, user]
  );

  const isSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending;

  const handleSubmit = async (formData) => {
    if (isEditMode) {
      await updateUserMutation.mutateAsync({ id, ...formData });
    } else {
      await createUserMutation.mutateAsync(formData);
    }

    navigate('/user-management');
  };

  if (isEditMode && isLoading) {
    return <PageLoader />;
  }

  if (isEditMode && (isError || !user)) {
    return (
      <div className="animate-in fade-in space-y-6 duration-500">
        <Breadcrumbs
          items={[
            { label: 'User', href: '/user-management' },
            { label: 'Edit User' },
          ]}
        />
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-xl border border-stroke-divider bg-layer1 p-8 text-center">
          <h1 className="text-2xl font-bold text-heading">User not found</h1>
          <p className="max-w-md text-sm text-paragraph">
            The selected user could not be loaded. Please return to the listing
            and try again.
          </p>
          <Button type="button" onClick={() => navigate('/user-management')}>
            Back to user listing
          </Button>
        </div>
      </div>
    );
  }

  const pageTitle = isEditMode ? 'Edit User' : 'New User Creation';
  const breadcrumbLabel = isEditMode ? 'Edit User' : 'New User Creation';
  const submitLabel = isEditMode ? 'Save changes' : 'Send Invite link';

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <Breadcrumbs
        items={[
          { label: 'User', href: '/user-management' },
          { label: breadcrumbLabel },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-heading">{pageTitle}</h1>
        <Button
          type="submit"
          form={USER_FORM_ID}
          className="h-11 shrink-0"
          isLoading={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>

      <CreateUserForm
        id={USER_FORM_ID}
        onSubmit={handleSubmit}
        initialValues={formState?.values}
        initialAssignedRms={formState?.assignedRms ?? []}
        isSubmitting={isSubmitting}
        isEditMode={isEditMode}
      />
    </div>
  );
};
