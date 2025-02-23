import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormType, loginSchema } from './schemas/loginSchema.ts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useRouter } from '@tanstack/react-router';
import { Route as loginRoute } from '@/routes/login';
import { useMutation } from '@tanstack/react-query';
import { REDIRECT_FALLBACK } from '@/lib/config';
import LoaderIcon from '@/components/ui/loader-icon';
import { isAxiosError } from 'axios';
import { useAuth } from './hooks/useAuth.ts';
import PasswordInput from '@/components/forms/PasswordInput.tsx';
import P from '@/components/typography/P';

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const navigate = loginRoute.useNavigate();
  const search = loginRoute.useSearch();

  // 1. Define your form.
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await router.invalidate();
      await navigate({ to: search.redirect || REDIRECT_FALLBACK });
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        form.setError('email', {
          type: 'server error',
          message: err?.response?.data?.message,
        });
      } else {
        form.setError('email', {
          type: 'server error',
          message: err?.message,
        });
      }
    },
  });

  // 2. Define a submit handler.
  function onSubmit({ email, password }: LoginFormType) {
    mutate({ email, password });
  }

  return (
    <Card className='min-w-96'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl'>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? <LoaderIcon /> : 'Login'}
            </Button>
          </form>
        </Form>
        <P className={'mt-4 text-center'}>
          <span className={'text-zinc-700'}>Don't have an account?</span>{' '}
          <Link to={'/register'} className={'font-bold text-zinc-900'}>
            Sign up
          </Link>
        </P>
      </CardContent>
    </Card>
  );
}
