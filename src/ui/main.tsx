import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createRouter,
  RouterProvider,
  createHashHistory,
} from '@tanstack/react-router';
import '@/styles/globals.css';
import { routeTree } from './routeTree.gen';

// Use hash-based routing (ingress-safe)
const router = createRouter({
  routeTree,
  history: createHashHistory(),
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
