import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100%',
      backgroundColor: 'var(--bg)'
    }}>
      <div style={{ 
        padding: '48px', 
        border: '1px solid var(--border)', 
        borderRadius: '12px', 
        width: '450px', 
        maxWidth: '90%',
        boxShadow: 'var(--shadow)',
        backgroundColor: 'var(--surface, #fff)' // fallback to white
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2>inXits</h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
