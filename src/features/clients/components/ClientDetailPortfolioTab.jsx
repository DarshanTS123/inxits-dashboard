import React from 'react';
import { Landmark, TrendingUp, Shield, PieChart } from 'lucide-react';
import { Card } from '@components/ui/Card/Card';
import { Button } from '@components/ui/Button/Button';
import SunburstChart from '@components/charts/SunburstChart';
import { cn } from '@utils/cn';

const PORTFOLIO_BRANCH_COLORS = {
  'Mutual Fund': '#4a90e2',
  Stock: '#9b59b6',
  Bonds: '#1abc9c',
  Insurance: '#28c76f',
  NPS: '#8e735b',
  AIF: '#e67e22',
  PMS: '#ea5758',
};

const sunburstData = {
  name: "Portfolio",
  children: [
    {
      name: "Mutual Fund",
      children: [
        { name: "Large Cap", value: 35 },
        { name: "Mid Cap", value: 15 },
        { name: "Small Cap", value: 10 },
      ]
    },
    {
      name: "Stock",
      children: [
        { name: "Tech", value: 20 },
        { name: "Pharma", value: 15 },
      ]
    },
    {
      name: "Bonds",
      value: 20
    },
    {
      name: "Insurance",
      value: 15
    },
    {
      name: "NPS",
      value: 10
    }
  ]
};

const investmentData = [
  {
    title: 'Mutual Funds',
    holdings: '3 Holdings',
    value: '₹8,45,200',
    change: '+12.5%',
    isPositive: true,
    items: [
      { name: 'SBI Bluechip Fund', label1: 'Current Value ₹3,45,100', label2: 'Invested ₹2,00,000', change: '+₹1,45,100 (+72.5%)' },
      { name: 'HDFC Balanced Advantage', label1: 'Current Value ₹2,99,000', label2: 'Invested ₹2,00,000', change: '+₹99,000 (+49.5%)' },
      { name: 'Axis Midcap Fund', label1: 'Current Value ₹2,01,100', label2: 'Invested ₹1,00,000', change: '+₹1,01,100 (+101%)' },
    ]
  },
  {
    title: 'Equities',
    holdings: '2 Holdings',
    value: '₹12,34,800',
    change: '+12.5%',
    isPositive: true,
    items: [
      { name: 'Reliance Industries', label1: 'Current Value ₹8,34,900', label2: 'Invested ₹7,00,000', change: '+₹1,34,900 (+19.2%)' },
      { name: 'TCS Ltd', label1: 'Current Value ₹3,99,900', label2: 'Invested ₹2,50,000', change: '+₹1,49,900 (+59.9%)' },
    ]
  },
  {
    title: 'Insurance',
    holdings: '2 Policies',
    value: '₹3,42,100',
    change: '+12.5%',
    isPositive: true,
    items: [
      { name: 'LIC Insurance', label1: 'Current Value ₹2,42,400', label2: 'Premium ₹2,00,000', change: '+₹42,400 (+21.2%)' },
      { name: 'Golic JeLi', label1: 'Current Value ₹99,700', label2: 'Premium ₹80,000', change: '+₹19,700 (+24.6%)' },
    ]
  },
  {
    title: 'Bonds & Debentures',
    holdings: '1 Holding',
    value: '₹5,00,000',
    change: '+10.2%',
    isPositive: true,
    items: [
      { name: 'RBI Floating Rate Bond 2020', label1: 'Current Value ₹5,00,000', label2: 'Invested ₹5,00,000', change: '+₹0 (0.0%)' },
    ]
  },
  {
    title: 'NPS',
    holdings: '2 Holdings',
    value: '₹3,42,100',
    change: '+10.2%',
    isPositive: true,
    items: [
      { name: 'Reliance Industries Ltd.', label1: 'Current Value ₹2,42,400', label2: 'Invested ₹2,00,000', change: '+₹42,400 (+21.2%)' },
      { name: 'Larsen & Toubro Ltd.', label1: 'Current Value ₹99,700', label2: 'Invested ₹80,000', change: '+₹19,700 (+24.6%)' },
    ]
  }
];

const ClientDetailPortfolioTabInner = () => {
  return (
    <div className="space-y-6">
      {/* Top Section */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          
          <div className="flex-1 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stroke-divider">
            <div>
              <h2 className="text-xl font-bold text-heading">Linked bank accounts</h2>
              <p className="text-sm text-paragraph mb-8">Last Updated: 12 min Ago</p>

              <h3 className="text-sm font-medium text-heading mb-2">Investment overview</h3>
              <div className="text-4xl font-bold text-primary mb-2">₹96,00,000</div>
              <div className="text-sm font-medium text-success mb-6">▲ +12.5% in last month</div>

              <div className="inline-flex items-center rounded-full bg-layer2 px-4 py-2 text-sm border border-stroke-divider">
                <span className="text-paragraph mr-2">Total Invest:</span>
                <span className="font-semibold text-heading">₹ 45,50,000</span>
              </div>
            </div>
          </div>

           <div className="flex-1 p-6 flex items-center justify-center">
             <div className="w-full max-w-[300px]" role="img" aria-label="Portfolio sunburst chart">
               <SunburstChart
                 data={sunburstData}
                 branchColors={PORTFOLIO_BRANCH_COLORS}
                 height={250}
                 className="border-0 shadow-none bg-transparent hover:border-transparent p-0"
               />
             </div>
           </div>

          <div className="flex-1 p-6 space-y-4 bg-layer1/50 border-t lg:border-t-0 lg:border-l border-stroke-divider flex flex-col justify-center">
            
            <div className="flex items-center gap-4 rounded-xl border border-stroke-divider bg-layer1 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-layer2">
                <Landmark className="h-5 w-5 text-paragraph" />
              </div>
              <div>
                <div className="text-sm font-medium text-paragraph">Banking</div>
                <div className="text-base font-bold text-heading">5 Accounts</div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-stroke-divider bg-layer1 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-layer2">
                <TrendingUp className="h-5 w-5 text-paragraph" />
              </div>
              <div>
                <div className="text-sm font-medium text-paragraph">Investments</div>
                <div className="text-base font-bold text-heading">28 Holdings</div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-stroke-divider bg-layer1 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-layer2">
                <Shield className="h-5 w-5 text-paragraph" />
              </div>
              <div>
                <div className="text-sm font-medium text-paragraph">Insurance</div>
                <div className="text-base font-bold text-heading">4 Policies</div>
              </div>
            </div>

          </div>
        </div>
      </Card>

      {/* Investment Portfolio Section */}
      <Card padding="lg" className="overflow-hidden">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-stroke-divider">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
               <PieChart className="h-5 w-5" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-heading">Investment Portfolio</h2>
               <p className="text-sm text-paragraph">188 registered records & 5 Instruments</p>
             </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-paragraph">Total Value</div>
            <div className="text-2xl font-bold text-heading">₹29,22,100</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {investmentData.map((category, idx) => (
            <Card key={category.title} padding="lg" className={cn(idx === 0 ? 'md:col-span-2' : '', 'bg-layer1 border-stroke-divider')}>
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-lg font-semibold text-heading">{category.title}</h3>
                   <div className="text-xs text-paragraph">{category.holdings}</div>
                 </div>
                 <div className="text-right">
                   <div className="text-lg font-semibold text-primary">{category.value}</div>
                   <div className={cn("text-xs font-medium", category.isPositive ? "text-success" : "text-danger")}>
                     {category.isPositive ? "▲" : "▼"} {category.change}
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 {category.items.map((item) => (
                   <div key={item.name} className="flex justify-between items-center pb-4 border-b border-stroke-divider last:border-0 last:pb-0">
                      <div>
                        <div className="text-sm font-medium text-heading mb-1">{item.name}</div>
                        <div className="flex items-center gap-2 text-xs text-paragraph">
                          <span>{item.label1}</span>
                          <span className="w-1 h-1 rounded-full bg-paragraph"></span>
                          <span>{item.label2}</span>
                        </div>
                      </div>
                      <div className="text-right text-xs font-medium text-success">
                         {item.change}
                      </div>
                   </div>
                 ))}
               </div>

               <div className="mt-6 pt-4 text-center border-t border-stroke-divider">
                 <Button type="button" variant="ghost" className="text-sm text-primary hover:underline font-medium">View More</Button>
               </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const ClientDetailPortfolioTab = React.memo(ClientDetailPortfolioTabInner);
