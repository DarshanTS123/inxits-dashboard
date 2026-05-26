import {
  AVAILABLE_RMS,
  RM_LEAD_ROLE,
  ROLE_OPTIONS,
  USER_OPTIONS,
} from '../constants/userFormConstants';

const ROLE_VALUE_TO_LABEL = {
  'rm-lead': 'RM Lead',
  'relationship-manager': 'Relationship Manager',
  admin: 'Admin',
};

const ROLE_LABEL_TO_VALUE = Object.fromEntries(
  Object.entries(ROLE_VALUE_TO_LABEL).map(([value, label]) => [label, value])
);

const OPTIONS_VALUE_TO_RM_TYPE = {
  'set-relationship-manager': 'Group Level',
  individual: 'Individual',
  'group-level': 'Group Level',
};

const RM_TYPE_TO_OPTIONS = Object.fromEntries(
  Object.entries(OPTIONS_VALUE_TO_RM_TYPE).map(([value, label]) => [label, value])
);

const splitUserName = (userName = '') => {
  const parts = userName.trim().split(/\s+/);

  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
};

const withActiveState = (rm) => ({
  ...rm,
  isActive: rm.isActive ?? true,
});

export const getAssignedRmsForUser = (user) => {
  if (user?.assignedRms?.length) {
    return user.assignedRms.map(withActiveState);
  }

  if (user?.rmAssignedCount > 0) {
    return AVAILABLE_RMS.slice(0, user.rmAssignedCount).map(withActiveState);
  }

  return [];
};

export const mapUserToFormValues = (user) => {
  if (!user) {
    return {
      firstName: '',
      lastName: '',
      userId: '',
      password: '',
      assignRole: '',
      options: '',
    };
  }

  const { firstName, lastName } = splitUserName(user.userName);

  return {
    firstName: user.firstName ?? firstName,
    lastName: user.lastName ?? lastName,
    userId: user.userId ?? '',
    password: user.password ?? '',
    assignRole:
      user.assignRole ?? ROLE_LABEL_TO_VALUE[user.roleAssigned] ?? '',
    options: user.options ?? RM_TYPE_TO_OPTIONS[user.rmType] ?? '',
  };
};

export const mapFormValuesToUser = (existingUser, formData) => {
  const userName = `${formData.firstName} ${formData.lastName}`.trim();
  const roleAssigned =
    ROLE_VALUE_TO_LABEL[formData.assignRole] ?? existingUser?.roleAssigned ?? '';
  const rmType =
    OPTIONS_VALUE_TO_RM_TYPE[formData.options] ?? existingUser?.rmType ?? '';
  const assignedRms = formData.assignedRms ?? [];
  const isRmLead = formData.assignRole === RM_LEAD_ROLE;
  const rmAssignedCount =
    isRmLead && rmType !== 'Individual' ? assignedRms.length : null;

  return {
    ...existingUser,
    userName,
    firstName: formData.firstName,
    lastName: formData.lastName,
    userId: formData.userId,
    password: formData.password,
    roleAssigned,
    assignRole: formData.assignRole,
    rmType,
    options: formData.options,
    rmAssignedCount,
    assignedRms: isRmLead ? assignedRms : [],
  };
};

export const getRoleLabel = (value) =>
  ROLE_OPTIONS.find((option) => option.value === value)?.label ?? value;

export const getOptionsLabel = (value) =>
  USER_OPTIONS.find((option) => option.value === value)?.label ?? value;
