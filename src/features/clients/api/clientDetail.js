import { useQuery } from '@tanstack/react-query';
import { privateApi } from '@lib/axios';

export const clientDetailKeys = {
  all: ['client-detail'],
  detail: (id) => [...clientDetailKeys.all, id],
};

const maskPan = (pan) => {
  if (!pan || pan.length < 4) return '****';
  return `${pan.slice(0, 1)}***${pan.slice(-4)}`;
};

const mergeSection = (base = {}, override = {}) => ({ ...base, ...override });

const mergeClientDetail = (client, template, overrides = {}) => {
  const rmAssigned = client.rm && client.rm !== '-';
  const kycCompleted = client.onboardingStatus === 'Completed';

  return {
    id: client.id,
    clientName: client.clientName,
    email: client.email,
    pan: client.pan,
    rm: client.rm,
    onboardingStatus: client.onboardingStatus,
    aum: client.aum,
    avatarUrl: overrides.avatarUrl ?? template.avatarUrl,
    personal: mergeSection(template.personal, {
      ...overrides.personal,
      email: client.email,
    }),
    riskProfile: mergeSection(template.riskProfile, overrides.riskProfile),
    kyc: mergeSection(template.kyc, {
      ...overrides.kyc,
      status: kycCompleted ? 'Completed' : 'Pending',
      panMasked: overrides.kyc?.panMasked ?? maskPan(client.pan),
    }),
    relationshipManager: mergeSection(template.relationshipManager, {
      ...overrides.relationshipManager,
      status: rmAssigned ? 'Assigned' : 'Not assigned',
      name: rmAssigned ? client.rm : '-',
      email: rmAssigned
        ? (overrides.relationshipManager?.email ?? '-')
        : '-',
    }),
    personalTab: {
      identity: overrides.personalTab?.identity ?? template.personalTab.identity,
      address: mergeSection(
        template.personalTab.address,
        overrides.personalTab?.address
      ),
      nominees: overrides.personalTab?.nominees ?? template.personalTab.nominees,
      fatca: overrides.personalTab?.fatca ?? template.personalTab.fatca,
      bank: overrides.personalTab?.bank ?? template.personalTab.bank,
      documents:
        overrides.personalTab?.documents ?? template.personalTab.documents,
    },
  };
};

const fetchClientDetail = async (id) => {
  const [clients, detailsMap] = await Promise.all([
    privateApi.get('/mock/clients.json'),
    privateApi.get('/mock/client-details.json'),
  ]);

  const client = Array.isArray(clients)
    ? clients.find((row) => row.id === id)
    : null;

  if (!client) {
    const error = new Error('Client not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  const template = detailsMap.default;
  const overrides = detailsMap.overrides?.[id] ?? {};

  return mergeClientDetail(client, template, overrides);
};

export const useClient = (id) => {
  return useQuery({
    queryKey: clientDetailKeys.detail(id),
    queryFn: () => fetchClientDetail(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};
