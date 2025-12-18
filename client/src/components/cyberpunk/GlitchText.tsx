import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface GlitchTextProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "green" | "purple" | "cyan";
  animate?: boolean;
}

const GlitchText = forwardRef<HTMLSpanElement, GlitchTextProps>(
  ({ className, variant = "green", animate = false, children, ...props }, ref) => {
    const variantStyles = {
      green: "text-[var(--neon-green)] neon-glow-green",
      purple: "text-[var(--neon-purple)] neon-glow-purple",
      cyan: "text-[var(--neon-cyan)] neon-glow-cyan",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "relative inline-block font-bold uppercase tracking-wider",
          variantStyles[variant],
          animate && "glitch",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

GlitchText.displayName = "GlitchText";

export { GlitchText };
