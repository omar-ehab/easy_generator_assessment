import LoginForm from '@/features/auth/LoginForm';
import { REDIRECT_FALLBACK } from '@/lib/config';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import AuthLogo from '@/assets/logo.svg';

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: async ({ context, search }) => {
    const user = await context.auth.initialize();
    if (user) {
      throw redirect({ to: search.redirect || REDIRECT_FALLBACK });
    }
  },
  component: Login,
});

function Login() {
  return (
    <div className='flex flex-col h-dvh w-dvw items-center justify-center bg-white'>
      <img src={AuthLogo} alt={'Easy Generator Logo'} className={'w-64 mb-8'} />
      <LoginForm />
    </div>
  );
}
