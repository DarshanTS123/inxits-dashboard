import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMatches, useNavigate } from 'react-router-dom';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import {
  selectIsDesktopSidebarCollapsed,
  toggleDesktopSidebarCollapsed,
} from '../../../features/layout/store/layoutSlice';
import { getCurrentRouteTitle } from '../../../routes/routeTitles';
import { useAuth } from '../../../features/auth/store/useAuth';
import { Button } from '../../ui/Button/Button';
import { DropdownMenuList } from '../../ui/DropdownMenu/DropdownMenu';

export const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const matches = useMatches();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isSidebarCollapsed = useSelector(selectIsDesktopSidebarCollapsed);

  const title = useMemo(() => {
    return getCurrentRouteTitle(matches);
  }, [matches]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const avatarLabel = user?.name?.charAt(0) || user?.email?.charAt(0) || 'U';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-stroke-divider bg-topnav px-4 backdrop-blur-48 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Open navigation menu"
          className="h-9 w-9 shrink-0 rounded-md border border-stroke-divider bg-layer1 p-0 text-icon-active hover:bg-white/10 focus:ring-primary/35 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <button
          type="button"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden size-8 shrink-0 items-center justify-center rounded-md text-paragraph transition-colors hover:text-subheading focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 md:inline-flex"
          onClick={() => dispatch(toggleDesktopSidebarCollapsed())}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="size-[18px]" strokeWidth={1.75} />
          ) : (
            <PanelLeftClose className="size-[18px]" strokeWidth={1.75} />
          )}
        </button>

        <h1 className="truncate text-base font-semibold text-heading sm:text-lg">
          {title}
        </h1>
      </div>

      <DropdownMenuList
        contentClassName="min-w-[88px]"
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Open account menu"
            className="h-9 w-9 rounded-full border-2 border-white bg-avatar p-0 text-sm font-semibold text-primary shadow-[0_0_0_1px_rgba(70,168,220,0.35)] hover:bg-white focus:ring-primary/35"
          >
            {avatarLabel.toUpperCase()}
          </Button>
        }
        items={[
          {
            id: 'logout',
            label: 'Logout',
            icon: LogOut,
            onSelect: handleLogout,
          },
        ]}
      />
    </header>
  );
};
