export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
      {/* Placeholder Widgets */}
      <div className="p-6 border border-gray-200 rounded-xl shadow-sm bg-white">
        <p className="m-0 text-gray-500 text-sm font-medium">Total Revenue</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">$45,231.89</h2>
      </div>
      <div className="p-6 border border-gray-200 rounded-xl shadow-sm bg-white">
        <p className="m-0 text-gray-500 text-sm font-medium">Active Users</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">+2350</h2>
      </div>
      <div className="p-6 border border-gray-200 rounded-xl shadow-sm bg-white">
        <p className="m-0 text-gray-500 text-sm font-medium">Sales</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">+12,234</h2>
      </div>
    </div>
  );
};
