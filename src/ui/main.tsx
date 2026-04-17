import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createRouter,
  RouterProvider,
  createBrowserHistory,
} from '@tanstack/react-router';

import '@/styles/globals.css';
import { routeTree } from './routeTree.gen';

/*
 * Compute the app base path in a way that works for:
 * - Normal root deployments:             /
 * - Home Assistant ingress deployments:  /api/hassio_ingress/<token>/
 */
function computeBaseName(): string {
  // 1) From <base> tag / document baseURI
  let baseFromBaseURI = '/';
  try {
    baseFromBaseURI = new URL(document.baseURI).pathname;
  } catch {
    // ignore
  }

  // 2) From pathname (HA ingress prefix pattern)
  const ingressMatch = window.location.pathname.match(
    /^(\/api\/hassio_ingress\/[^/]+)/,
  );
  const baseFromIngressPath = ingressMatch ? ingressMatch[1] : '';

  // Prefer ingress prefix if detected, else prefer baseURI, else '/'
  let chosen = baseFromIngressPath || baseFromBaseURI || '/';

  // Normalise: remove trailing slash (except keep "/" as "/")
  if (chosen.length > 1) {
    chosen = chosen.replace(/\/+$/, '');
  }

  // Ensure it always starts with "/"
  if (!chosen.startsWith('/')) {
    chosen = `/${chosen}`;
  }

  return chosen;
}

const basename = computeBaseName();

// Create browser history with basename (critical for subpath deployments)
const history = createBrowserHistory({
  basename,
});

// Create router instance
const router = createRouter({
  routeTree,
  history,
  basepath: basename,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

/**
 * Router bootstrap component:
 * - Helps embedded/iframe environments by forcing a stable first navigation
 * - Adds debug output so we can confirm the new build is running (important with caching)
 * - Optionally suppresses known noisy AbortError unhandled rejections
 */
function RouterBootstrap() {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.info('[ODE UI] Router bootstrap');
    // eslint-disable-next-line no-console
    console.info('[ODE UI] location.href:', window.location.href);
    // eslint-disable-next-line no-console
    console.info('[ODE UI] document.baseURI:', document.baseURI);
    // eslint-disable-next-line no-console
    console.info('[ODE UI] computed basename:', basename);

    // Suppress noisy unhandled rejections caused by aborted transitions in embedded contexts
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const msg =
        typeof reason === 'object' && reason && 'message' in reason
          ? // @ts-expect-error - runtime check
            String(reason.message)
          : String(reason);

      if (msg.includes('Transition was skipped')) {
        event.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    // Force a deterministic first navigation after mount.
    const navOnce = () => {
      try {
        void router.navigate({ to: '/', replace: true });
      } catch {
        // ignore
      }
    };

    // Do it immediately (microtask) and again shortly after (iframe/ingress settle)
    queueMicrotask(navOnce);
    const t = window.setTimeout(navOnce, 250);

    return () => {
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      window.clearTimeout(t);
    };
  }, []);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterBootstrap />
  </React.StrictMode>,
);
``
