import { ReactNode } from "react";

interface PremiumCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  borderColor: string;
  iconBgColor: string;
  className?: string;
}

export default function PremiumCard({
  icon,
  title,
  description,
  borderColor,
  iconBgColor,
  className = ""
}: PremiumCardProps) {
  return (
    <div className={`group relative ${className}`}>
      {/* Neon glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-30"
        style={{ backgroundColor: borderColor }}
      />
      
      {/* Card content */}
      <div 
        className="relative bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 h-full flex flex-col border-2 hover:border-opacity-80 transition-all duration-300"
        style={{ borderColor }}
      >
        {/* Large icon at top */}
        <div 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 
          className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-3 sm:mb-4 tracking-wide"
          style={{ fontFamily: "'Eurostile Bold Extended', 'Bungee', sans-serif" }}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
}
