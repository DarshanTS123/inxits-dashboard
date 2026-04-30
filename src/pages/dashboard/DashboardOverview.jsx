import { DashboardStats } from '../../features/dashboard/components/DashboardStats';
import { DashboardChartArea } from '../../features/dashboard/components/DashboardChartArea';

export const DashboardOverview = () => {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">Overview</h1>
      
      <DashboardStats />
      <DashboardChartArea />
    </div>
  );
};
