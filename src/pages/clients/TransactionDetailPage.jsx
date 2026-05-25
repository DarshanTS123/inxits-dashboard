import { useParams, useNavigate } from 'react-router-dom';
import { useClient } from '@features/clients/api/clientDetail';
import { TransactionDetail } from '@features/clients/components/TransactionDetail';
import { PageLoader } from '@components/ui/PageLoader';
import { Breadcrumbs } from '@components/ui/Breadcrumbs/Breadcrumbs';
import { Button } from '@components/ui/Button/Button';

export const TransactionDetailPage = () => {
  const { id, transactionId } = useParams();
  const navigate = useNavigate();
  const { data: client, isLoading, isError } = useClient(id);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !client) {
    return (
      <div className="animate-in fade-in space-y-6 duration-500">
        <Breadcrumbs
          items={[
            { label: 'Clients', href: '/clients' },
            { label: 'Error' },
          ]}
        />
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-xl border border-stroke-divider bg-layer1 p-8 text-center">
          <h1 className="text-2xl font-bold text-heading">
            Unable to load client
          </h1>
          <p className="max-w-md text-sm text-paragraph">
            Something went wrong while loading this client. Please try again.
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Go back
            </Button>
            <Button type="button" onClick={() => navigate('/clients')}>
              Back to clients
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // We are using mocked data here based on the screenshot, as requested in the plan
  // Real implementation would look up the transaction from the client object or API
  const mockTransaction = {
    id: transactionId,
    schemeName: 'ICICI Prudential Short Term Fund Direct Plan Growth',
    amount: '₹500',
    typeLabel: 'MF Redemption',
    logo: 'i', // Mocking the red logo as 'i'
    orderDetails: {
      amountTransferredOn: '22 September 2025',
      bankAccount: 'Axis Bank (xx2542)',
      navDate: '21 September 2025',
      folioNo: '1049091692',
      orderId: transactionId,
      unit: '9.435',
    },
    statusTimeline: [
      {
        id: 1,
        status: 'Order Placed',
        date: '17 Sep 2025, 10:01 AM',
        completed: true,
      },
      {
        id: 2,
        status: 'In process',
        date: '17 Sep 2025, 10:01 AM',
        completed: true,
      },
      {
        id: 3,
        status: 'Settled',
        date: '17 Sep 2025, 10:01 AM',
        completed: true,
      }
    ],
    currentStatus: 'Completed',
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <Breadcrumbs
        items={[
          { label: 'Clients', href: '/clients' },
          { label: client.clientName, href: `/clients/${client.id}?tab=transactions` },
          { label: transactionId },
        ]}
      />
      <TransactionDetail transaction={mockTransaction} />
    </div>
  );
};
