import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
// import { ThemeProvider } from './providers/ThemeProvider';
import './index.css';

function App() {
  return (
    // <ThemeProvider>
      <RouterProvider router={router} />
    // </ThemeProvider>
  );
}

export default App;
