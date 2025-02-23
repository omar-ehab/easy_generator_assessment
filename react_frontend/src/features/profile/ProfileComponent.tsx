import { useAuth } from '@/features/auth/hooks/useAuth.ts';
import { Card } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { Route as profileRoute } from '@/routes/_auth/dashboard/profile.tsx';

export default function ProfileComponent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const navigate = profileRoute.useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await router.invalidate();
      await navigate({ to: '/login' });
    },
  });
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-6'>
      <Card className='w-full max-w-md p-6'>
        <div className='flex flex-col items-center'>
          <div className='flex size-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white'>
            {user?.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
          <h2 className='mt-4 text-xl font-semibold text-gray-900'>
            {user?.name}
          </h2>
          <p className='text-gray-500'>{user?.email}</p>
        </div>

        {/* User Info */}
        <div className='mt-6 space-y-4'>
          <div className='flex justify-between border-b pb-2'>
            <span className='text-gray-600'>User ID:</span>
            <span className='font-medium text-gray-900'>{user?.id}</span>
          </div>
          <div className='flex justify-between border-b pb-2'>
            <span className='text-gray-600'>Full Name:</span>
            <span className='font-medium text-gray-900'>{user?.name}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Email:</span>
            <span className='font-medium text-gray-900'>{user?.email}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className='mt-6 flex justify-center space-x-4'>
          <Button
            onClick={() => mutate()}
            className={`bg-red-600 text-white hover:bg-red-700`}
          >
            {isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
