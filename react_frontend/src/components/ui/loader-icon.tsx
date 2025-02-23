import { Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

type Props = {
  className?: string;
};
export default function LoaderIcon({ className }: Props) {
  return <Loader2Icon className={cn('animate-spin', className)} />;
}
