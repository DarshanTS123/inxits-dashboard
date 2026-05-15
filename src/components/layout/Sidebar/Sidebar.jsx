import { useDispatch, useSelector } from 'react-redux';
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
  X,
} from 'lucide-react';
import logo from '../../../assets/Inxits.svg';
import logoIcon from '../../../assets/Inxits-icon.svg';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../ui/Tooltip/Tooltip';
import { Button } from '../../ui/Button/Button';
import { cn } from '../../../utils/cn';
import {
  selectIsDesktopSidebarCollapsed,
  toggleDesktopSidebarCollapsed,
} from '../../../features/layout/store/layoutSlice';

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

export const Sidebar = ({ isMobileOpen = false, onMobileClose }) => {
  const dispatch = useDispatch();
  const isCollapsed = useSelector(selectIsDesktopSidebarCollapsed);

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex h-screen w-sidebar max-w-[86vw] flex-col border-r border-stroke-divider bg-sidebar shadow-2xl transition-all duration-300 ease-in-out md:sticky md:top-0 md:z-auto md:max-w-none md:shadow-none',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        isCollapsed ? 'md:w-sidebar-collapsed' : 'md:w-sidebar'
      )}
    >
      <div
        className={cn(
          'sticky top-0 z-10 flex min-h-[72px] items-center justify-between gap-3 bg-sidebar-header px-4 py-2 md:min-h-[80px]',
          isCollapsed ? 'md:justify-center' : 'md:justify-start'
        )}
      >
        <>
          <img
            src={logo}
            alt="Inxits Logo"
            className={cn(
              'h-[52px] w-full max-w-[112px] object-contain transition-all duration-300',
              isCollapsed && 'md:hidden'
            )}
          />
          {isCollapsed && (
            <img
              src={logoIcon}
              alt="Inxits Logo"
              className="hidden h-[52px] w-[52px] max-w-none object-contain transition-all duration-300 md:block"
            />
          )}
        </>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Close navigation menu"
          className="h-9 w-9 shrink-0 rounded-md border border-white/10 bg-white/5 p-0 text-icon-active hover:bg-white/10 focus:ring-primary/35 md:hidden"
          onClick={onMobileClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={() => dispatch(toggleDesktopSidebarCollapsed())}
        className="absolute right-0 top-[80px] z-20 hidden h-6 w-6 -translate-y-1/2 translate-x-1/2 rounded-full border border-stroke-divider bg-sidebar-header p-0 text-icon-active shadow-sm hover:bg-white/10 md:flex"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>

      <nav className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-visible p-3 sm:p-4">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} onClick={onMobileClose}>
            {({ isActive }) => {
              const content = (
                <div
                  className={cn(
                    'relative flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200',
                    isActive
                      ? 'bg-[rgba(255,255,255,0.12)] text-primary'
                      : 'text-icon-active hover:bg-white/5',
                    isCollapsed && 'md:justify-center md:px-0'
                  )}
                >
                  <item.icon size={20} className="shrink-0" />
                  <span
                    className={cn(
                      'whitespace-nowrap text-[15px] font-medium transition-all duration-300',
                      isCollapsed && 'md:hidden'
                    )}
                  >
                    {item.label}
                  </span>

                  <div
                    className={cn(
                      'absolute bottom-[15%] right-0 top-[15%] w-1 rounded-l-full bg-primary transition-opacity',
                      isActive ? 'opacity-100' : 'opacity-0'
                    )}
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
