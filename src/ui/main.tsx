import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createRouter,
  RouterProvider,
  createBrowserHistory,
} from '@tanstack/react-router';
import '@/styles/globals.css';
import { routeTree } from './routeTree.gen';

// Derive ingress-safe base from document base URI
const basename = new URL(document.baseURI).pathname.replace(/\/$/, '');

// Create browser history with basename
const history = createBrowserHistory({
  basename,
});

// Create router WITHOUT basepath
const router = createRouter({
  routeTree,
  history,
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
