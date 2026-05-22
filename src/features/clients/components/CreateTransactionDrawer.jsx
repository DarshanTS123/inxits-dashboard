import { useMemo } from 'react';
import { Calendar, ChevronDown, FileX, RefreshCw } from 'lucide-react';

import { Button } from '@components/ui/Button/Button';
import { DatePicker } from '@components/ui/DatePicker/DatePicker';
import { Drawer } from '@components/ui/Drawer/Drawer';
import { Select } from '@components/ui/Select/Select';
import { Tabs } from '@components/ui/Tabs/Tabs';
import { cn } from '@utils/cn';
import { useCreateTransactionDrawer } from '../hooks/useCreateTransactionDrawer';

const COMPACT_TRIGGER_CLASS =
  'h-9 w-auto min-w-[128px] gap-1.5 rounded-lg border-stroke-divider bg-layer2 px-3 text-xs font-medium text-heading';

const MandateEmptyState = () => (
  <div className="flex min-h-[220px] flex-col items-center justify-center px-4 py-12 text-center">
    <div
      className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-stroke-divider/80 bg-layer2"
      aria-hidden
    >
      <FileX className="h-8 w-8 text-paragraph/60" strokeWidth={1.5} />
    </div>
    <p className="text-base font-semibold text-heading">No Mandates Found</p>
    <p className="mt-2 max-w-[320px] text-sm leading-relaxed text-paragraph/75">
      You don&apos;t have an active mandate yet. To continue investing, please
      create or select a mandate.
    </p>
  </div>
);

const FrequencySelect = ({ value, onValueChange, options }) => (
  <div className="relative shrink-0">
    <RefreshCw
      className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-icon-primary"
      aria-hidden
    />
    <Select
      value={value}
      onValueChange={onValueChange}
      options={options}
      triggerClassName={cn(COMPACT_TRIGGER_CLASS, 'pl-9')}
    />
  </div>
);

const SipPanel = ({
  formattedAmount,
  onAmountChange,
  frequency,
  setFrequency,
  frequencyOptions,
  sipDate,
  setSipDate,
  sipDateLabel,
}) => (
  <>
    <div className="overflow-hidden rounded-xl border border-stroke-divider bg-layer1">
      <div className="p-4 text-center">
        <p className="text-paragraph">Enter SIP Amount</p>
        <label htmlFor="invest-sip-amount" className="sr-only">
          Enter SIP Amount
        </label>
        <input
          id="invest-sip-amount"
          type="text"
          inputMode="numeric"
          value={formattedAmount}
          onChange={onAmountChange}
          className="mt-4 w-full border-0 bg-transparent text-center text-[40px] font-bold leading-none tracking-tight text-heading outline-none focus-visible:ring-0"
          aria-label="Enter SIP Amount"
        />
      </div>
    </div>
    <div className="flex justify-center gap-2 mt-5">
      <FrequencySelect
        value={frequency}
        onValueChange={setFrequency}
        options={frequencyOptions}
      />
      <div className="relative shrink-0">
        <Calendar
          className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-icon-primary"
          aria-hidden
        />
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-paragraph"
          aria-hidden
        />
        <DatePicker
          mode="single"
          value={sipDate}
          onChange={setSipDate}
          displayLabel={sipDateLabel}
          showFooter={false}
          showTriggerIcon={false}
          align="center"
          triggerClassName={cn(
            COMPACT_TRIGGER_CLASS,
            'min-w-[148px] justify-center pl-9 pr-8'
          )}
        />
      </div>
    </div>

    <div className="mt-5 p-4  overflow-hidden rounded-xl border border-stroke-divider bg-layer1">
      <p className="text-center leading-relaxed text-paragraph">
        Your SIP would be processed on 30th of every month. SIP will be active
        until cancelled.
      </p>
    </div>
  </>
);

const LumpsumPanel = ({ formattedAmount, onAmountChange }) => (
  <>
    <div className="overflow-hidden rounded-xl border border-stroke-divider bg-layer1">
      <div className="p-4 text-center">
        <p className="text-paragraph">Enter Lumpsum Amount</p>
        <label htmlFor="invest-lumpsum-amount" className="sr-only">
          Enter Lumpsum Amount
        </label>
        <input
          id="invest-lumpsum-amount"
          type="text"
          inputMode="numeric"
          value={formattedAmount}
          onChange={onAmountChange}
          className="mt-4 w-full border-0 bg-transparent text-center text-[40px] font-bold leading-none tracking-tight text-heading outline-none focus-visible:ring-0"
          aria-label="Enter Lumpsum Amount"
        />
      </div>
    </div>

    <div className="mt-5 overflow-hidden rounded-xl border border-stroke-divider bg-layer1 p-4">
      <p className="text-center leading-relaxed text-paragraph">
        Your lumpsum investment will be processed once the payment is confirmed.
      </p>
    </div>
  </>
);

export const CreateTransactionDrawer = ({ open, onOpenChange }) => {
  const {
    investmentType,
    setInvestmentType,
    formattedAmount,
    primaryActionLabel,
    frequency,
    setFrequency,
    sipDate,
    setSipDate,
    sipDateLabel,
    payFirstInstalment,
    setPayFirstInstalment,
    frequencyOptions,
    handleOpenChange,
    handleAmountChange,
    handleSubmit,
  } = useCreateTransactionDrawer(onOpenChange);

  const tabItems = useMemo(
    () => [
      {
        value: 'sip',
        label: 'SIP',
        contentClassName: 'mt-5 p-0',
        content: (
          <SipPanel
            formattedAmount={formattedAmount}
            onAmountChange={handleAmountChange}
            frequency={frequency}
            setFrequency={setFrequency}
            frequencyOptions={frequencyOptions}
            sipDate={sipDate}
            setSipDate={setSipDate}
            sipDateLabel={sipDateLabel}
          />
        ),
      },
      {
        value: 'lumpsum',
        label: 'Lumpsum',
        contentClassName: 'mt-5 p-0',
        content: (
          <LumpsumPanel
            formattedAmount={formattedAmount}
            onAmountChange={handleAmountChange}
          />
        ),
      },
    ],
    [
      formattedAmount,
      frequency,
      frequencyOptions,
      handleAmountChange,
      setFrequency,
      setSipDate,
      sipDate,
      sipDateLabel,
    ]
  );

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      title="Invest"
      size="lg"
      contentClassName="px-6 py-6 sm:px-8 sm:py-7 lg:px-10"
      footerClassName="h-auto min-h-[72px] flex-col-reverse gap-4 border-t border-stroke-divider bg-layer3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-4 lg:px-10"
      footer={
        <>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-paragraph/70">
            <input
              type="checkbox"
              checked={payFirstInstalment}
              onChange={(event) => setPayFirstInstalment(event.target.checked)}
              className="h-4 w-4 rounded border-stroke-divider bg-transparent accent-primary"
            />
            <span>Pay first instalment now</span>
          </label>
          <Button
            type="button"
            className="h-12 min-w-[200px] rounded-xl bg-primary px-10 text-base font-semibold text-white hover:opacity-90"
            onClick={handleSubmit}
          >
            {primaryActionLabel}
          </Button>
        </>
      }
    >
      <Tabs
        variant="segmented"
        value={investmentType}
        onValueChange={setInvestmentType}
        items={tabItems}
        contentClassName="outline-none"
      />

      <section className="mt-8">
        <div className="mb-1 flex items-center gap-4">
          <h3 className="shrink-0 font-semibold text-heading">
            Select mandate
          </h3>
        </div>
        <div className="h-px flex-1 bg-stroke-divider" aria-hidden />
        <MandateEmptyState />
      </section>
    </Drawer>
  );
};
