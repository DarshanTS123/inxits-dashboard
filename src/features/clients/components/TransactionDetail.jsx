import { CheckCircle2 } from 'lucide-react';
import { cn } from '@utils/cn';

const TimelineItem = ({ status, date, isLast, completed }) => (
  <div className="relative flex gap-4 pb-8 last:pb-0">
    {!isLast && (
      <div className="absolute left-3 top-6 bottom-0 -ml-[1px] w-[2px] bg-stroke-divider" aria-hidden />
    )}
    
    <div className="relative z-10 flex shrink-0 items-start">
      {completed ? (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1db56c]">
          <CheckCircle2 className="h-4 w-4 text-white" />
        </div>
      ) : (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-layer3 border border-stroke-divider" />
      )}
    </div>
    
    <div className="flex flex-col pt-0.5">
      <p className="text-sm font-semibold text-heading">{status}</p>
      <p className="mt-1 text-[13px] text-paragraph">{date}</p>
    </div>
  </div>
);

export const TransactionDetail = ({ transaction }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
      {/* Left Column: Order Details */}
      <div className="rounded-xl border border-stroke-divider bg-layer1">
        {/* Header Section */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-2xl font-bold text-white shadow-lg">
              <span className="italic">{transaction.logo}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-heading">{transaction.schemeName}</h2>
              <p className="mt-1 text-sm text-paragraph">{transaction.typeLabel}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-heading">{transaction.amount}</p>
          </div>
        </div>

        <div className="mx-6 h-px bg-stroke-divider" />

        {/* Order Details Section */}
        <div className="p-6">
          <h3 className="mb-6 text-base font-medium text-heading">Order Details</h3>
          
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-1.5">
              <p className="text-[13px] text-paragraph">Amount transferred on</p>
              <p className="text-sm font-semibold text-heading">{transaction.orderDetails.amountTransferredOn}</p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-[13px] text-paragraph">Bank account</p>
              <p className="text-sm font-semibold text-heading">{transaction.orderDetails.bankAccount}</p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-[13px] text-paragraph">Nav date</p>
              <p className="text-sm font-semibold text-heading">{transaction.orderDetails.navDate}</p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-[13px] text-paragraph">Folio no</p>
              <p className="text-sm font-semibold text-heading">{transaction.orderDetails.folioNo}</p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-[13px] text-paragraph">Order Id</p>
              <p className="text-sm font-semibold text-heading">{transaction.orderDetails.orderId}</p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-[13px] text-paragraph">Unit</p>
              <p className="text-sm font-semibold text-heading">{transaction.orderDetails.unit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Status */}
      <div className="rounded-xl border border-stroke-divider bg-layer1">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-base font-medium text-heading">Status</h2>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1db56c]" />
            <span className="text-sm font-medium text-[#1db56c]">{transaction.currentStatus}</span>
          </div>
        </div>
        
        <div className="mx-6 h-px bg-stroke-divider" />
        
        <div className="p-6">
          {transaction.statusTimeline.map((item, index) => (
            <TimelineItem
              key={item.id}
              status={item.status}
              date={item.date}
              completed={item.completed}
              isLast={index === transaction.statusTimeline.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
