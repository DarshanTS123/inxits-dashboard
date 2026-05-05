import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { QueryProvider } from './providers/QueryProvider';
import { Toaster } from 'sonner';
import { TooltipProvider } from './components/ui/Tooltip/Tooltip';
import './index.css';

function App() {
  return (
    <QueryProvider>
      <Toaster position="top-right" richColors closeButton />
      <TooltipProvider delayDuration={0}>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryProvider>
  );
}

export default App;
