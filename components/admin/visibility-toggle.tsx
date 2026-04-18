"use client";

import * as Switch from "@radix-ui/react-switch";
import { useTransition } from "react";
import { toggleSoftwareVisibilityAction } from "@/lib/actions/admin";

export function VisibilityToggle({ softwareId, initialHidden }: { softwareId: string; initialHidden: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <Switch.Root
      checked={!initialHidden}
      disabled={pending}
      onCheckedChange={(checked) => {
        startTransition(async () => {
          await toggleSoftwareVisibilityAction(softwareId, !checked);
        });
      }}
      className="relative h-6 w-10 rounded-full bg-slate-700 data-[state=checked]:bg-emerald-500"
    >
      <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[18px]" />
    </Switch.Root>
  );
}
