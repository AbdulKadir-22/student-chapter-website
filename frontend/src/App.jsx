import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router';
import { AuthProvider } from './features/auth/hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#ffffff',
              color: '#1e293b',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '14px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 10px 25px -5px rgba(99, 50, 236, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}