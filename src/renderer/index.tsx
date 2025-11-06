import ReactDom from 'react-dom/client';
import React from 'react';

import { AppRoutes } from './routes';
import { AuthProvider } from './contexts/AuthContext';

import './globals.css';

ReactDom.createRoot(document.querySelector('app') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
