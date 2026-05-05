import { useMemo } from 'react';
import { useMatches, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { authUtils } from '../../../utils/auth';
import { getCurrentRouteTitle } from '../../../routes/routeTitles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/DropdownMenu/DropdownMenu';

export const Header = ({ onMenuClick }) => {
  const matches = useMatches();
  const navigate = useNavigate();

  const title = useMemo(() => {
    return getCurrentRouteTitle(matches);
  }, [matches]);

  const handleLogout = () => {
    authUtils.logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-stroke-divider bg-topnav px-4 backdrop-blur-48 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-stroke-divider bg-layer1 text-icon-active transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/35 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="truncate text-base font-semibold text-subheading sm:text-lg">
          {title}
        </h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Open account menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#dff3fb] text-sm font-semibold text-primary shadow-[0_0_0_1px_rgba(70,168,220,0.35)] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/35"
          >
            A
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-[88px]">
          <DropdownMenuItem onSelect={handleLogout}>
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
