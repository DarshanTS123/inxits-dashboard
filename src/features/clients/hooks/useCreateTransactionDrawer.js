import { useMemo, useState } from 'react';
import { isValid } from 'date-fns';

const FREQUENCY_OPTIONS = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
];

const DEFAULT_AMOUNT = 5000;
const DEFAULT_SIP_DAY = 26;

const createDefaultSipDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), DEFAULT_SIP_DAY);
};

const getOrdinalSuffix = (day) => {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const formatSipOnDay = (date) => {
  if (!date || !isValid(date)) return 'SIP on —';
  const day = date.getDate();
  return `SIP on ${day}${getOrdinalSuffix(day)}`;
};

const formatInrAmount = (value) => {
  const numeric = Number(String(value).replace(/[^\d]/g, '')) || 0;
  return `₹${numeric.toLocaleString('en-IN')}`;
};

export const useCreateTransactionDrawer = (onOpenChange) => {
  const [investmentType, setInvestmentType] = useState('sip');
  const [amount, setAmount] = useState(String(DEFAULT_AMOUNT));
  const [frequency, setFrequency] = useState('monthly');
  const [sipDate, setSipDate] = useState(createDefaultSipDate);
  const [payFirstInstalment, setPayFirstInstalment] = useState(true);

  const formattedAmount = useMemo(() => formatInrAmount(amount), [amount]);
  const sipDateLabel = useMemo(() => formatSipOnDay(sipDate), [sipDate]);

  const primaryActionLabel = investmentType === 'sip' ? 'Start SIP' : 'Invest Now';

  const reset = () => {
    setInvestmentType('sip');
    setAmount(String(DEFAULT_AMOUNT));
    setFrequency('monthly');
    setSipDate(createDefaultSipDate());
    setPayFirstInstalment(true);
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value.replace(/[^\d]/g, ''));
  };

  const handleSubmit = () => {
    reset();
    onOpenChange(false);
  };

  return {
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
    frequencyOptions: FREQUENCY_OPTIONS,
    handleOpenChange,
    handleAmountChange,
    handleSubmit,
  };
};
