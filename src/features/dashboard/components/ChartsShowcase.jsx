import { useEffect, useState } from 'react';
import { DonutChart, PieChart, GaugeChart, SunburstChart } from '@components/charts';

const ChartsShowcase = () => {
  const [loading, setLoading] = useState(true);

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
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0d1526] min-h-screen">
      {/* Donut Chart — Client Segmentation by Risk */}
      <DonutChart
        title="Client Segmentation by Risk"
        data={riskData}
        loading={loading}
        height={380}
        colors={['#E07B39', '#3598E4', '#114F7E', '#C96868', '#7893CD']}
      />

      {/* Pie Chart — AUM by Category */}
      <PieChart
        title="AUM by category"
        data={aumData}
        loading={loading}
        height={380}
        colors={['#C06161', '#7B94C9', '#E07B39', '#619082', '#8F9BCC']}
      />

      {/* Gauge Chart — Risk Score */}
      <GaugeChart
        title="Portfolio Risk Score"
        value={65}
        label="Moderate : 65/100"
        loading={loading}
        height={380}
      />

      {/* Sunburst Chart — Asset Allocation Hierarchy */}
      <SunburstChart
        title="Asset Allocation Hierarchy"
        data={assetAllocationData}
        loading={loading}
        height={500}
        className="md:col-span-2"
      />
    </div>
  );
};

export default ChartsShowcase;
