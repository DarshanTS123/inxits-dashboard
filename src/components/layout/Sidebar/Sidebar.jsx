import React, { useState } from 'react';
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
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import logo from '../../../assets/Inxits.svg';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../ui/Tooltip/Tooltip';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/clients', label: 'Clients', icon: Users },
  { path: '/portfolio', label: 'Portfolio Oversight', icon: Briefcase },
  { path: '/support', label: 'Support Management', icon: Headset },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/user-management', label: 'User Management', icon: UserPlus },
  { path: '/universe', label: 'Universe', icon: Globe },
  {
    path: '/application-management',
    label: 'Application Management',
    icon: Settings2,
  },
  { path: '/compliance', label: 'Compliance Report', icon: FileCheck },
  { path: '/aum-reports', label: 'AUM Reports', icon: CircleGauge },
  { path: '/reports', label: 'Reports', icon: FileText },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-stroke-divider bg-sidebar sticky top-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
      }`}
    >
      {/* Header — always shows logo */}
      <div className="flex min-h-[80px] items-center justify-center bg-sidebar-header px-4 py-2 sticky top-0 z-10">
        {isCollapsed ? (
          <img
            src={logo}
            alt="Inxits Logo"
            className="h-8 w-8 object-contain transition-all duration-300"
          />
        ) : (
          <img
            src={logo}
            alt="Inxits Logo"
            className="h-auto w-full max-w-[112px] object-contain transition-all duration-300"
          />
        )}
      </div>

      {/* Toggle button — sits on the right border, vertically centered on the header bottom edge */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-0 top-[80px] z-20 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-stroke-divider bg-sidebar-header text-icon-active shadow-sm hover:bg-white/10 transition-all duration-200"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto overflow-x-visible custom-scrollbar">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {({ isActive }) => {
              const content = (
                <div
                  className={`
                    relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200
                    ${
                      isActive
                        ? 'bg-[rgba(255,255,255,0.12)] text-primary'
                        : 'text-icon-active hover:bg-white/5'
                    }
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  <item.icon size={20} className="shrink-0" />
                  {!isCollapsed && (
                    <span className="text-[15px] font-medium whitespace-nowrap transition-all duration-300">
                      {item.label}
                    </span>
                  )}

                  {/* Active Indicator Bar */}
                  <div
                    className={`
                      absolute right-0 top-[15%] bottom-[15%] w-1 rounded-l-full bg-primary 
                      transition-opacity
                      ${isActive ? 'opacity-100' : 'opacity-0'}
                    `}
                  />
                </div>
              );

              if (isCollapsed) {
                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full">{content}</div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return content;
            }}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
