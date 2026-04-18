import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
