import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { QueryProvider } from './providers/QueryProvider';
import { Toaster } from 'sonner';
import { TooltipProvider } from './components/ui/Tooltip/Tooltip';
import { AuthProvider } from './features/auth/store/AuthContext';
import './index.css';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Toaster position="top-right" richColors closeButton />
        <TooltipProvider delayDuration={0}>
          <RouterProvider router={router} />
        </TooltipProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
