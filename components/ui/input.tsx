import { type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-border bg-zinc-950 px-3 py-2 text-sm outline-none ring-white/30 placeholder:text-zinc-500 focus:ring-2',
        className
      )}
      {...props}
    />
  );
}
