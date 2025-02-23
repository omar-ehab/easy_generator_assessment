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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useRouter } from '@tanstack/react-router';
import { Route as registerRoute } from '@/routes/register';
import { useMutation } from '@tanstack/react-query';
import { REDIRECT_FALLBACK } from '@/lib/config';
import LoaderIcon from '@/components/ui/loader-icon';
import { isAxiosError } from 'axios';
import { useAuth } from './hooks/useAuth.ts';
import PasswordInput from '@/components/forms/PasswordInput.tsx';
import P from '@/components/typography/P';
import {
  RegisterFormType,
  registerSchema,
} from '@/features/auth/schemas/registerSchema.ts';

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const navigate = registerRoute.useNavigate();
  const search = registerRoute.useSearch();

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: async () => {
      await router.invalidate();
      await navigate({ to: search.redirect || REDIRECT_FALLBACK });
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        err?.response?.data?.message.forEach(
          (m: { message: string; property: 'name' | 'email' | 'password' }) => {
            form.setError(m.property, {
              type: 'server error',
              message: m.message,
            });
          }
        );
      } else {
        form.setError('email', {
          type: 'server error',
          message: err?.message,
        });
      }
    },
  });

  function onSubmit({ name, email, password }: RegisterFormType) {
    mutate({ name, email, password });
  }

  return (
    <Card className='min-w-96'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl'>Create New Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              render={({ field }) => {
                const password = field.value || ''; // Ensure password is not undefined
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>

                    {/* Real-time validation feedback */}
                    {password.length > 0 && (
                      <div className='mt-2 space-y-1 text-sm'>
                        <p
                          className={
                            password.length >= 8
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {password.length >= 8 ? '✔' : '✖'} At least 8
                          characters
                        </p>
                        <p
                          className={
                            /[A-Za-z]/.test(password)
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {/[A-Za-z]/.test(password) ? '✔' : '✖'} At least one
                          letter
                        </p>
                        <p
                          className={
                            /\d/.test(password)
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {/\d/.test(password) ? '✔' : '✖'} At least one
                          number
                        </p>
                        <p
                          className={
                            /[^A-Za-z0-9]/.test(password)
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {/[^A-Za-z0-9]/.test(password) ? '✔' : '✖'} At least
                          one special character
                        </p>
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? <LoaderIcon /> : 'Create an account'}
            </Button>
          </form>
        </Form>
        <P className={'mt-4 text-center'}>
          <span className={'text-zinc-700'}>Already have an account?</span>{' '}
          <Link to={'/login'} className={'font-bold text-zinc-900'}>
            Login
          </Link>
        </P>
      </CardContent>
    </Card>
  );
}
