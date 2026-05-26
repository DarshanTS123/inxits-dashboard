import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { privateApi } from '@lib/axios';

import {
  mapFormValuesToUser,
  mapUserToFormValues,
  getAssignedRmsForUser,
} from '../utils/userFormMappers';

export const userManagementKeys = {
  all: ['user-management'],
  list: () => [...userManagementKeys.all, 'list'],
  detail: (id) => [...userManagementKeys.all, 'detail', id],
};

const MOCK_DELAY_MS = 400;

const delay = (ms = MOCK_DELAY_MS) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const fetchUsers = async () => {
  const data = await privateApi.get('/mock/user-management.json');
  return data?.users ?? [];
};

const fetchUserById = async (id) => {
  const users = await fetchUsers();
  const user = users.find((item) => item.id === id);

  if (!user) {
    const error = new Error('User not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  return user;
};

const createUser = async (payload) => {
  await delay();

  const users = await fetchUsers();
  const nextUser = mapFormValuesToUser(
    {
      id: `user-${users.length + 1}`,
      createdBy: 'Admin',
      createdOn: new Date().toISOString(),
    },
    payload
  );

  return nextUser;
};

const updateUser = async ({ id, ...payload }) => {
  await delay();

  const existingUser = await fetchUserById(id);
  return mapFormValuesToUser(existingUser, payload);
};

export const useUsers = () => {
  return useQuery({
    queryKey: userManagementKeys.list(),
    queryFn: fetchUsers,
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: userManagementKeys.detail(id),
    queryFn: () => fetchUserById(id),
    enabled: Boolean(id),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (createdUser) => {
      queryClient.setQueryData(userManagementKeys.list(), (currentUsers = []) => [
        createdUser,
        ...currentUsers,
      ]);
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Unable to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userManagementKeys.list(), (currentUsers = []) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      queryClient.setQueryData(
        userManagementKeys.detail(updatedUser.id),
        updatedUser
      );
      toast.success('User updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Unable to update user');
    },
  });
};

export const getUserFormState = (user) => ({
  values: mapUserToFormValues(user),
  assignedRms: getAssignedRmsForUser(user),
});
