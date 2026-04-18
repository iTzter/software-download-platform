import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none ring-accent/40 placeholder:text-slate-500 focus:ring-2",
        className
      )}
      {...props}
    />
  );
}
