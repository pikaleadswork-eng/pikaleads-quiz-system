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
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <div className="bg-zinc-900 border border-yellow-400/30 rounded-lg px-3 py-2 min-w-[60px] text-center">
          <div className="text-2xl font-bold text-yellow-400 font-mono">
            {String(hours).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
            годин
          </div>
        </div>
        <div className="text-yellow-400 text-2xl font-bold">:</div>
        <div className="bg-zinc-900 border border-yellow-400/30 rounded-lg px-3 py-2 min-w-[60px] text-center">
          <div className="text-2xl font-bold text-yellow-400 font-mono">
            {String(minutes).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
            хвилин
          </div>
        </div>
        <div className="text-yellow-400 text-2xl font-bold">:</div>
        <div className="bg-zinc-900 border border-yellow-400/30 rounded-lg px-3 py-2 min-w-[60px] text-center">
          <div className="text-2xl font-bold text-yellow-400 font-mono">
            {String(seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
            секунд
          </div>
        </div>
      </div>
    </div>
  );
}
