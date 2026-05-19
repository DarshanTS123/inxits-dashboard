import { useEffect, useState } from 'react';
import { DonutChart, PieChart, GaugeChart, SunburstChart } from '@components/charts';

const ChartsShowcase = () => {
  const [loading, setLoading] = useState(true);

  const segmentationColors = [
    '#124e7a',
    '#6889c9',
    '#b85c5c',
    '#d97a32',
    '#2e8fd4',
  ];

  const gaugeBands = [
    { start: 0, end: 20, color: '#1e9e58' },
    { start: 20, end: 40, color: '#8ec800' },
    { start: 40, end: 60, color: '#efbf00' },
    { start: 60, end: 80, color: '#e67e22' },
    { start: 80, end: 100, color: '#ea5758' },
  ];

  const branchColors = {
    'Mutual Fund': '#4a90e2',
    Stock: '#8b5cf6',
    Bonds: '#1abc9c',
    Insurance: '#28c76f',
    NPS: '#8e735b',
    AIF: '#e67e22',
    PMS: '#ea5758',
  };

  // Mock Data 1: Client Segmentation by Risk
  const riskData = [
    { category: 'Conservative', value: 78 },
    { category: 'Moderately Conservative', value: 42 },
    { category: 'Moderate', value: 42 },
    { category: 'Moderately Aggressive', value: 42 },
    { category: 'Aggressive', value: 24 },
  ];

  // Mock Data 2: AUM by Category
  const aumData = [
    { category: 'Equity Fund', value: 30 },
    { category: 'Debt Fund', value: 20 },
    { category: 'Hybrid Fund', value: 20 },
    { category: 'Cash', value: 30 },
    { category: 'Other', value: 30 },
  ];

  // Mock Data 3: Asset Allocation Hierarchy (Sunburst)
  const assetAllocationData = {
    name: "Total Assets",
    children: [
      {
        name: "Mutual Fund",
        children: [
          {
            name: "Equity",
            children: [
              { name: "Large", value: 100 },
              { name: "Mid", value: 60 },
              { name: "Small", value: 40 },
            ],
          },
          {
            name: "Debt",
            children: [
              { name: "SOV", value: 50 },
              { name: "AAA", value: 40 },
              { name: "AA", value: 30 },
              { name: "A", value: 20 },
              { name: "Unrated", value: 10 },
            ],
          },
          { name: "Other", value: 30 },
          { name: "Cash", value: 20 },
        ],
      },
      {
        name: "Stock",
        children: [
          { name: "LargeCap", value: 80 },
          { name: "MidCap", value: 60 },
          { name: "SmallCap", value: 40 },
          { name: "Microcap", value: 20 },
        ],
      },
      {
        name: "Bonds",
        children: [
          { name: "Bonds", value: 40 }, // Image shows "Bonds" again inside? No, probably Corporate/SDL/SOV
          { name: "Corporate", value: 30 },
          { name: "SDL (State Govt)", value: 25 },
          { name: "SOV", value: 20 },
        ],
      },
      {
        name: "Insurance",
        children: [
          {
            name: "Life",
            children: [
              { name: "ULIF", value: 30 },
              { name: "Term Plan", value: 25 },
            ],
          },
          {
            name: "Non-Life",
            children: [
              { name: "Vehicle", value: 20 },
            ],
          },
        ],
      },
      { name: "NPS", value: 25 },
      { name: "AIF", value: 20 },
      { name: "PMS", value: 15 },
    ],
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-page min-h-screen">
      <DonutChart
        title="Client Segmentation by Risk"
        data={riskData}
        loading={loading}
        height={380}
        colors={segmentationColors}
      />

      <PieChart
        title="AUM by category"
        data={aumData}
        loading={loading}
        height={380}
        colors={segmentationColors}
      />

      <GaugeChart
        title="Portfolio Risk Score"
        value={65}
        label="Moderate : 65/100"
        bands={gaugeBands}
        loading={loading}
        height={380}
      />

      <SunburstChart
        title="Asset Allocation Hierarchy"
        data={assetAllocationData}
        branchColors={branchColors}
        loading={loading}
        height={500}
        className="md:col-span-2"
      />
    </div>
  );
};

export default ChartsShowcase;
