import { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { PageLoader } from '../components/ui/PageLoader';
import { Sidebar } from '../components/layout/Sidebar/Sidebar';
import { Header } from '../components/layout/Header/Header';
import {
  closeMobileSidebar,
  openMobileSidebar,
  selectIsMobileSidebarOpen,
} from '../features/layout/store/layoutSlice';

export const MainLayout = () => {
  const dispatch = useDispatch();
  const isMobileSidebarOpen = useSelector(selectIsMobileSidebarOpen);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-page text-paragraph">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => dispatch(closeMobileSidebar())}
      />

      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-20 bg-black/55 backdrop-blur-sm md:hidden"
          onClick={() => dispatch(closeMobileSidebar())}
        />
      )}

      <div className="main-content flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => dispatch(openMobileSidebar())} />

        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};
