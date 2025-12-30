import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";
import "./lib/i18n";
import "./lib/removeConnectionNotification";

// Analytics are now loaded dynamically via AnalyticsScripts component

const queryClient = new QueryClient();

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/thank-you',
  '/privacy',
  '/contact',
];

const isPublicRoute = (path: string): boolean => {
  // Exact match for public routes
  if (PUBLIC_ROUTES.includes(path)) return true;
  
  // Pattern match for quiz routes
  if (path.startsWith('/quiz/')) return true;
  if (path.startsWith('/meta-')) return true;
  if (path.startsWith('/google-')) return true;
  
  return false;
};

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;
  
  // Don't redirect to login if user is on a public route
  const currentPath = window.location.pathname;
  if (isPublicRoute(currentPath)) {
    console.log('[Auth] Skipping redirect on public route:', currentPath);
    return;
  }

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </HelmetProvider>
);
