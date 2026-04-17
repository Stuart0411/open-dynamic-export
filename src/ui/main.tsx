import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import '@/styles/globals.css';
import { routeTree } from './routeTree.gen';

// Detect Home Assistant ingress base path if present
// e.g. /api/hassio_ingress/<token>/...
const match = window.location.pathname.match(/^(\/api\/hassio_ingress\/[^/]+)/);
const basepath = match ? match[1] : '/';

// Create a new router instance
const router = createRouter({
  routeTree,
  basepath,
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
