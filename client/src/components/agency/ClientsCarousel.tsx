export default function ClientsCarousel() {
  // Placeholder logos - will be replaced with real client logos later
  const placeholderLogos = [
    { id: 1, name: "Client 1" },
    { id: 2, name: "Client 2" },
    { id: 3, name: "Client 3" },
    { id: 4, name: "Client 4" },
    { id: 5, name: "Client 5" },
    { id: 6, name: "Client 6" },
    { id: 7, name: "Client 7" },
    { id: 8, name: "Client 8" },
    { id: 9, name: "Client 9" },
    { id: 10, name: "Client 10" },
    { id: 11, name: "Client 11" },
    { id: 12, name: "Client 12" }
  ];

  // Duplicate logos for seamless infinite scroll
  const allLogos = [...placeholderLogos, ...placeholderLogos];

  return (
    <section className="relative py-12 md:py-20 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,217,61,0.05)_0%,transparent_70%)]"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 animate-fadeInUp">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-purple-900/30 to-yellow-900/30 border border-yellow-400/20 rounded-full">
            <span className="text-yellow-400 text-xs md:text-sm font-semibold tracking-wider uppercase">
              🤝 Довіра лідерів ринку
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'Eurostile, sans-serif' }}>
            <span className="text-white">З КИМ МИ </span>
            <span className="text-yellow-400" style={{ textShadow: '0 0 30px rgba(255,217,61,0.5)' }}>ПРАЦЮВАЛИ</span>
          </h2>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
            Нам довіряють провідні компанії України та Європи. 
            Від стартапів до корпорацій — ми знаємо як масштабувати бізнес.
          </p>
        </div>

        {/* Infinite Carousel */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>

          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll">
              {allLogos.map((logo, index) => (
                <div
                  key={`${logo.id}-${index}`}
                  className="flex-shrink-0 w-48 h-32 mx-4 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl flex items-center justify-center hover:border-yellow-400/40 transition-all duration-300 group"
                >
                  {/* Placeholder Logo */}
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-2 bg-gradient-to-br from-purple-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl font-bold text-yellow-400" style={{ fontFamily: 'Eurostile, sans-serif' }}>
                        {logo.id}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">{logo.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 md:mt-16">
          <div className="text-center p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'Eurostile, sans-serif' }}>
              500+
            </div>
            <p className="text-gray-400 text-sm">Успішних проектів</p>
          </div>
          
          <div className="text-center p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'Eurostile, sans-serif' }}>
              12+
            </div>
            <p className="text-gray-400 text-sm">Країн присутності</p>
          </div>
          
          <div className="text-center p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'Eurostile, sans-serif' }}>
              97%
            </div>
            <p className="text-gray-400 text-sm">Задоволених клієнтів</p>
          </div>
          
          <div className="text-center p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'Eurostile, sans-serif' }}>
              5+
            </div>
            <p className="text-gray-400 text-sm">Років на ринку</p>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
