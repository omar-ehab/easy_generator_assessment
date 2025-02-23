import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};
export default function P({ children, size = 'md', className }: Props) {
  return (
    <p
      className={cn(
        '',
        {
          'text-sm': size === 'sm',
          'text-base': size === 'md',
          'text-xl': size === 'lg',
        },
        className
      )}
    >
      {children}
    </p>
  );
}
