"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  value?: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, indicatorClassName, ...props }, ref) => {
  const getProgressColor = (value: number) => {
    if (value >= 90) return "bg-[#1cc7695e]/60";
    if (value >= 80) return "bg-[#22c55e]/60";
    if (value >= 70) return "bg-[#5fcc16]/60";
    if (value >= 50) return "bg-[#84cc16]/60";
    if (value >= 40) return "bg-[#ead308]/60";
    if (value >= 30) return "bg-[#eab308]/60";
    if (value >= 20) return "bg-[#f97316]/60";
    if (value >= 10) return "bg-[#f95a16]/60";
    if (value >= 0) return "bg-[#ef4444]/60";
    return "bg-[#22c55e]/60";
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted/30",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full transition-transform duration-300 rounded-full",
          getProgressColor(value),
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
