import {
  createRouter,
  ErrorComponent,
  RouterProvider,
} from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { AuthProvider } from './features/auth/context/AuthProvider.tsx';
import { useAuth } from './features/auth/hooks/useAuth.ts';
import ScreenLoader from '@/components/loaders/ScreenLoader.tsx';

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <ScreenLoader />
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
  defaultPreload: 'intent',
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return (
    <RouterProvider
      router={router}
      defaultPreload='intent'
      context={{ auth }}
    />
  );
}

export function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
