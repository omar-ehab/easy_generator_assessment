import LoaderIcon from '@/components/ui/loader-icon.tsx';

export default function ScreenLoader() {
  return (
    <div className={'flex h-svh w-full items-center justify-center'}>
      <LoaderIcon />
    </div>
  );
}
