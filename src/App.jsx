import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { QueryProvider } from './providers/QueryProvider';
import { Toaster } from 'sonner';
import './index.css';

function App() {
  return (
    <QueryProvider>
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
