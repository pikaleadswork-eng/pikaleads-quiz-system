import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "purple" | "cyan" | "pink";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "green", size = "md", glow = true, children, ...props }, ref) => {
    const variantStyles = {
      green: "bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 border-[var(--neon-green)]",
      purple: "bg-[var(--neon-purple)] text-white hover:bg-[var(--neon-purple)]/90 border-[var(--neon-purple)]",
      cyan: "bg-[var(--neon-cyan)] text-black hover:bg-[var(--neon-cyan)]/90 border-[var(--neon-cyan)]",
      pink: "bg-[var(--neon-pink)] text-white hover:bg-[var(--neon-pink)]/90 border-[var(--neon-pink)]",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const glowStyles = glow ? {
      green: "shadow-[0_0_10px_var(--neon-green-glow),0_0_20px_var(--neon-green-glow)] hover:shadow-[0_0_15px_var(--neon-green-glow),0_0_30px_var(--neon-green-glow)]",
      purple: "shadow-[0_0_10px_var(--neon-purple-glow),0_0_20px_var(--neon-purple-glow)] hover:shadow-[0_0_15px_var(--neon-purple-glow),0_0_30px_var(--neon-purple-glow)]",
      cyan: "shadow-[0_0_10px_var(--neon-cyan-glow),0_0_20px_var(--neon-cyan-glow)] hover:shadow-[0_0_15px_var(--neon-cyan-glow),0_0_30px_var(--neon-cyan-glow)]",
      pink: "shadow-[0_0_10px_var(--neon-pink-glow),0_0_20px_var(--neon-pink-glow)] hover:shadow-[0_0_15px_var(--neon-pink-glow),0_0_30px_var(--neon-pink-glow)]",
    } : {};

    return (
      <button
        ref={ref}
        className={cn(
          "relative font-bold uppercase tracking-wider",
          "border-2 rounded-md",
          "transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-95",
          variantStyles[variant],
          sizeStyles[size],
          glow && glowStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";

export { NeonButton };
