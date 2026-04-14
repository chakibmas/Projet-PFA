import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { QueryProvider } from './providers/QueryProvider';
import { SnackbarProvider } from './providers/SnackbarContext';
import { router } from './router';

export default function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
