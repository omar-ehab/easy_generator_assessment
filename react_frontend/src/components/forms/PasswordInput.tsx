import { Input } from '@/components/ui/input.tsx';
import { forwardRef, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const PasswordInput = forwardRef<HTMLInputElement>(
  ({ ...props }, ref) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    return (
      <div className={'relative'}>
        <Input type={isVisible ? 'text' : 'password'} {...props} ref={ref} />
        {isVisible ? (
          <EyeOffIcon
            onClick={() => setIsVisible(false)}
            className={
              'absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-zinc-800 dark:text-zinc-400'
            }
          />
        ) : (
          <EyeIcon
            onClick={() => setIsVisible(true)}
            className={
              'absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-zinc-800 dark:text-zinc-400'
            }
          />
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
