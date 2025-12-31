import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  className?: string;
}

export function CountdownTimer({ className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    // Get stored timer data from localStorage
    const storedData = localStorage.getItem('auditTimerData');
    const now = Date.now();

    if (storedData) {
      const { endTime, lastResetDate } = JSON.parse(storedData);
      const today = new Date().toDateString();

      // Check if it's a new day - reset timer
      if (lastResetDate !== today) {
        const newEndTime = now + 15 * 60 * 1000; // 15 minutes from now
        localStorage.setItem('auditTimerData', JSON.stringify({
          endTime: newEndTime,
          lastResetDate: today
        }));
        setTimeLeft(15 * 60 * 1000);
      } else {
        // Continue existing timer
        const remaining = endTime - now;
        setTimeLeft(remaining > 0 ? remaining : 0);
      }
    } else {
      // First time - create new timer
      const newEndTime = now + 15 * 60 * 1000;
      const today = new Date().toDateString();
      localStorage.setItem('auditTimerData', JSON.stringify({
        endTime: newEndTime,
        lastResetDate: today
      }));
      setTimeLeft(15 * 60 * 1000);
    }

    // Update timer every second
    const interval = setInterval(() => {
      const storedData = localStorage.getItem('auditTimerData');
      if (storedData) {
        const { endTime } = JSON.parse(storedData);
        const remaining = endTime - Date.now();
        setTimeLeft(remaining > 0 ? remaining : 0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {/* Hours */}
        <div className="relative group flex-1 max-w-[90px] sm:max-w-[110px] md:max-w-[140px]">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-purple-500/20 rounded-lg sm:rounded-xl blur-md sm:blur-lg group-hover:blur-xl transition-all" />
          <div className="relative bg-zinc-900/80 border border-yellow-400/40 sm:border-2 rounded-lg sm:rounded-xl px-2 py-3 sm:px-3 sm:py-4 md:px-4 md:py-5 text-center backdrop-blur-sm">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFD93D] font-mono tracking-tight" style={{
              textShadow: '0 0 15px rgba(255, 217, 61, 0.8), 0 0 30px rgba(255, 217, 61, 0.4)',
              fontFamily: "'Rajdhani', monospace"
            }}>
              {String(hours).padStart(2, '0')}
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 uppercase tracking-wider sm:tracking-widest mt-1 sm:mt-2 font-bold" style={{
              fontFamily: "'Rajdhani', sans-serif"
            }}>
              годин
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400/60 pb-4 sm:pb-5 md:pb-6">:</div>

        {/* Minutes */}
        <div className="relative group flex-1 max-w-[90px] sm:max-w-[110px] md:max-w-[140px]">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-purple-500/20 rounded-lg sm:rounded-xl blur-md sm:blur-lg group-hover:blur-xl transition-all" />
          <div className="relative bg-zinc-900/80 border border-yellow-400/40 sm:border-2 rounded-lg sm:rounded-xl px-2 py-3 sm:px-3 sm:py-4 md:px-4 md:py-5 text-center backdrop-blur-sm">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFD93D] font-mono tracking-tight" style={{
              textShadow: '0 0 15px rgba(255, 217, 61, 0.8), 0 0 30px rgba(255, 217, 61, 0.4)',
              fontFamily: "'Rajdhani', monospace"
            }}>
              {String(minutes).padStart(2, '0')}
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 uppercase tracking-wider sm:tracking-widest mt-1 sm:mt-2 font-bold" style={{
              fontFamily: "'Rajdhani', sans-serif"
            }}>
              хвилин
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400/60 pb-4 sm:pb-5 md:pb-6">:</div>

        {/* Seconds */}
        <div className="relative group flex-1 max-w-[90px] sm:max-w-[110px] md:max-w-[140px]">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-purple-500/20 rounded-lg sm:rounded-xl blur-md sm:blur-lg group-hover:blur-xl transition-all" />
          <div className="relative bg-zinc-900/80 border border-yellow-400/40 sm:border-2 rounded-lg sm:rounded-xl px-2 py-3 sm:px-3 sm:py-4 md:px-4 md:py-5 text-center backdrop-blur-sm">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFD93D] font-mono tracking-tight" style={{
              textShadow: '0 0 15px rgba(255, 217, 61, 0.8), 0 0 30px rgba(255, 217, 61, 0.4)',
              fontFamily: "'Rajdhani', monospace"
            }}>
              {String(seconds).padStart(2, '0')}
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 uppercase tracking-wider sm:tracking-widest mt-1 sm:mt-2 font-bold" style={{
              fontFamily: "'Rajdhani', sans-serif"
            }}>
              секунд
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
