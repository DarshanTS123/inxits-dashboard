import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg)' }}>
      {/* Sidebar Placeholder */}
      <aside style={{ width: '260px', borderRight: '1px solid var(--border)', padding: '24px' }}>
        <h2>inXits</h2>
        <p style={{ color: 'var(--text)', fontSize: '14px', marginTop: '32px' }}>Sidebar Navigation</p>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header Placeholder */}
        <header style={{ height: '70px', borderBottom: '1px solid var(--border)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3>Dashboard</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>Profile</span>
          </div>
        </header>

        {/* Main Page Content Area */}
        <main style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
