import ReactDom from 'react-dom/client';
import React from 'react';

import { AppRoutes } from './routes';
import { UserProvider } from './contexts/UserContext';

import './globals.css';

ReactDom.createRoot(document.querySelector('app') as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  </React.StrictMode>
);
