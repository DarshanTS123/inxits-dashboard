import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar/Sidebar';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-page text-paragraph">
      <Sidebar />

      <div className="flex flex-1 flex-col main-content">
        {/* Header with Glassmorphism */}
        <header className="sticky top-0 z-10 flex h-[70px] items-center justify-between border-b border-stroke-divider bg-topnav px-8 backdrop-blur-48">
          <h3 className="text-lg font-semibold text-heading">Overview</h3>
          
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-layer2 text-icon-active">
              AD
            </div>
            <span className="text-sm font-medium text-text-enabled">Admin User</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
