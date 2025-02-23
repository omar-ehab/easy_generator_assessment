import { AuthContext } from '@/features/auth/context/AuthProvider.tsx';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
type MyRouterContext = {
  auth: AuthContext;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) await context.auth.initialize();
  },
  component: () => (
    <>
      <div className='h-dvh w-full'>
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
