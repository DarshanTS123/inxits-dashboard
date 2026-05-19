import { useParams } from 'react-router-dom';

import { PageLoader } from '@components/ui/PageLoader';
import { useClient } from '@features/clients/api/clientDetail';
import {
  ClientDetail,
  ClientDetailError,
  ClientDetailNotFound,
} from '@features/clients/components/ClientDetail';

export const ClientDetailPage = () => {
  const { id } = useParams();
  const { data: client, isLoading, isError, error } = useClient(id);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    if (error?.code === 'NOT_FOUND') {
      return <ClientDetailNotFound />;
    }
    return <ClientDetailError />;
  }

  if (!client) {
    return <ClientDetailNotFound />;
  }

  return <ClientDetail client={client} />;
};
