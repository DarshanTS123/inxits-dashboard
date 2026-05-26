import { Plus, Search } from 'lucide-react';

import { Button } from '@components/ui/Button/Button';
import { Input } from '@components/ui/Input/Input';

export const UserManagementHeader = ({
  query,
  onQueryChange,
  onNewUser,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="w-full sm:max-w-[280px]">
        <Input
          size="sm"
          placeholder="Search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          leftIcon={Search}
          className="h-10"
          aria-label="Search users"
        />
      </div>

      <Button
        type="button"
        leftIcon={Plus}
        className="h-10 shrink-0"
        onClick={onNewUser}
      >
        New User
      </Button>
    </div>
  );
};
