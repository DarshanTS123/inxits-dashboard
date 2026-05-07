import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { router } from './routes';
import { QueryProvider } from './providers/QueryProvider';
import { Toaster } from 'sonner';
import { TooltipProvider } from './components/ui/Tooltip/Tooltip';
import { store } from './store';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <QueryProvider>
        <Toaster position="top-right" richColors closeButton />
        <TooltipProvider delayDuration={0}>
          <RouterProvider router={router} />
        </TooltipProvider>
      </QueryProvider>
    </Provider>
  );
}

export default App;
