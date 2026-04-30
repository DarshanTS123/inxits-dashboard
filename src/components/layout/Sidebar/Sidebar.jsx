import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Headset, 
  ArrowLeftRight, 
  UserPlus, 
  Globe, 
  Settings2, 
  FileCheck, 
  CircleGauge, 
  FileText 
} from 'lucide-react';
import logo from '../../../assets/Inxits.svg';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/clients', label: 'Clients', icon: Users },
  { path: '/portfolio', label: 'Portfolio Oversight', icon: Briefcase },
  { path: '/support', label: 'Support Management', icon: Headset },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/user-management', label: 'User Management', icon: UserPlus },
  { path: '/universe', label: 'Universe', icon: Globe },
  { path: '/application-management', label: 'Application Management', icon: Settings2 },
  { path: '/compliance', label: 'Compliance Report', icon: FileCheck },
  { path: '/aum-reports', label: 'AUM Reports', icon: CircleGauge },
  { path: '/reports', label: 'Reports', icon: FileText },
];

export const Sidebar = () => {
  return (
    <aside className="flex h-screen w-sidebar flex-col overflow-y-auto border-r border-stroke-divider bg-outline-disabled sticky top-0">
      <div className="flex min-h-[80px] items-center justify-start bg-sidebar-header px-4 py-2 sticky top-0 z-10">
        <img src={logo} alt="Inxits Logo" className="h-auto w-full max-w-[112px] object-contain" />
      </div>
      
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `
              relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200
              ${isActive 
                ? 'bg-[rgba(255,255,255,0.12)] text-primary' 
                : 'text-icon-active hover:bg-white/5'}
            `}
          >
            <item.icon size={20} className="shrink-0" />
            <span className="text-[15px] font-medium whitespace-nowrap">{item.label}</span>
            
            {/* Active Indicator Bar */}
            <div className="absolute right-0 top-[15%] bottom-[15%] w-1 rounded-l-full bg-primary opacity-0 transition-opacity aria-[current=page]:opacity-100" />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
