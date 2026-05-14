import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { router } from './routes';
import { QueryProvider } from './providers/QueryProvider';
import { Toaster } from 'sonner';
import { TooltipProvider } from './components/ui/Tooltip/Tooltip';
import { store, persistor } from './store';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryProvider>
          <Toaster position="top-right" richColors />
          <TooltipProvider delayDuration={0}>
            <RouterProvider router={router} />
          </TooltipProvider>
        </QueryProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
