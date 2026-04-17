import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import '@/styles/globals.css';
import { routeTree } from './routeTree.gen';

// Ingress-safe basepath detection (uses <base href>)
const basepath = new URL(document.baseURI).pathname.replace(/\/$/, '');

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
