import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "grid" | "gradient" | "particles";
}

const AnimatedBackground = forwardRef<HTMLDivElement, AnimatedBackgroundProps>(
  ({ className, variant = "grid", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative min-h-screen w-full overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Background Layer */}
        {variant === "grid" && (
          <div className="absolute inset-0 cyber-grid opacity-30" />
        )}
        
        {variant === "gradient" && (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black" />
        )}
        
        {variant === "particles" && (
          <div className="absolute inset-0">
            {/* Floating particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[var(--neon-green)] rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Scan lines overlay */}
        <div className="absolute inset-0 scan-lines opacity-10 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

AnimatedBackground.displayName = "AnimatedBackground";

export { AnimatedBackground };
