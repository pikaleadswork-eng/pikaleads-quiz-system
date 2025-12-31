import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiEffectProps {
  trigger: boolean;
  colors?: string[];
  duration?: number;
}

export function ConfettiEffect({
  trigger,
  colors = ["#FFD93D", "#5B2E90", "#3B82F6", "#10B981", "#EF4444"],
  duration = 3000,
}: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger) return;

    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [trigger, colors, duration]);

  return null;
}

export function fireConfetti(colors?: string[]) {
  const defaultColors = ["#FFD93D", "#5B2E90", "#3B82F6", "#10B981", "#EF4444"];
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors || defaultColors,
  });
}
