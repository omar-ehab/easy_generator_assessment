import { createFileRoute } from '@tanstack/react-router';
import ProfileComponent from '@/features/profile/ProfileComponent.tsx';

export const Route = createFileRoute('/_auth/dashboard/profile')({
  component: Profile,
});

function Profile() {
  return (
    <ProfileComponent />
  );
}
