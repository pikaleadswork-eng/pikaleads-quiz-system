import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CyberpunkCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "green" | "purple" | "cyan" | "default";
  glow?: boolean;
  scanLines?: boolean;
  hover?: boolean;
}

const CyberpunkCard = forwardRef<HTMLDivElement, CyberpunkCardProps>(
  ({ className, variant = "default", glow = true, scanLines = false, hover = true, children, ...props }, ref) => {
    const variantStyles = {
      green: "border-[var(--neon-green)]",
      purple: "border-[var(--neon-purple)]",
      cyan: "border-[var(--neon-cyan)]",
      default: "border-border",
    };

    const glowStyles = glow && variant !== "default" ? {
      green: "shadow-[0_0_15px_var(--neon-green-glow)]",
      purple: "shadow-[0_0_15px_var(--neon-purple-glow)]",
      cyan: "shadow-[0_0_15px_var(--neon-cyan-glow)]",
    } : {};

    const hoverStyles = hover && variant !== "default" ? {
      green: "hover:shadow-[0_0_25px_var(--neon-green-glow)] hover:border-[var(--neon-green)]",
      purple: "hover:shadow-[0_0_25px_var(--neon-purple-glow)] hover:border-[var(--neon-purple)]",
      cyan: "hover:shadow-[0_0_25px_var(--neon-cyan-glow)] hover:border-[var(--neon-cyan)]",
    } : {};

    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-card text-card-foreground rounded-lg border-2 p-6",
          "transition-all duration-300",
          variantStyles[variant],
          glow && variant !== "default" && glowStyles[variant],
          hover && variant !== "default" && hoverStyles[variant],
          scanLines && "scan-lines",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CyberpunkCard.displayName = "CyberpunkCard";

export { CyberpunkCard };
