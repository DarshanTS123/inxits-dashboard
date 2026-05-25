import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';

export const TransactionControls = ({ query, onQueryChange }) => {
  return (
    <div className="flex items-center justify-end">
      <Input
        placeholder="Search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        leftIcon={Search}
        size="sm"
        className="w-full max-w-sm"
      />
    </div>
  );
};
