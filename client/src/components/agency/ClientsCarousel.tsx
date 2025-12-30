export default function ClientsCarousel() {
  // Real client logos
  const clientLogos = [
    { id: 1, name: "Caruso Shoes", image: "/clients/carusoshoes-enhanced.png" },
    { id: 2, name: "Coral Travel", image: "/clients/coraltravel-enhanced.png" },
    { id: 3, name: "Emmi", image: "/clients/emmi-enhanced.png" },
    { id: 4, name: "Flower Shop", image: "/clients/flower-enhanced.png" },
    { id: 5, name: "Karpachoff", image: "/clients/karpachoff-enhanced.png" },
    { id: 6, name: "Nasledniki", image: "/clients/nasledniki-enhanced.png" },
    { id: 7, name: "OptMaster", image: "/clients/optmaster-enhanced.png" },
    { id: 8, name: "Parkside", image: "/clients/parkside-enhanced.png" },
    { id: 9, name: "Client 6", image: "/clients/client6-enhanced.png" }
  ];

  // Duplicate logos for seamless infinite scroll
  const allLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,217,61,0.05)_0%,transparent_70%)]"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 animate-fadeInUp">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-purple-900/30 to-yellow-900/30 border border-yellow-400/20 rounded-full">
            <span className="text-yellow-400 text-xs md:text-sm font-semibold tracking-wider uppercase">
              🤝 Довіра лідерів ринку
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6" style={{ fontFamily: 'Eurostile, sans-serif' }}>
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
            <div className="flex animate-scroll gap-4 sm:gap-6 md:gap-8">
              {allLogos.map((logo, index) => (
                <div
                  key={`${logo.id}-${index}`}
                  className="flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-44 h-20 sm:h-24 md:h-28 flex items-center justify-center group"
                >
                  {/* Logo Image - NO BACKGROUND */}
                  <img 
                    src={logo.image} 
                    alt={logo.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-10 md:mt-12 lg:mt-16">
          <div className="text-center p-4 sm:p-5 md:p-6 bg-zinc-900/30 border border-zinc-800 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2" style={{ fontFamily: 'Eurostile, sans-serif' }}>
              500+
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">Успішних проектів</p>
          </div>
          
          <div className="text-center p-4 sm:p-5 md:p-6 bg-zinc-900/30 border border-zinc-800 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2" style={{ fontFamily: 'Eurostile, sans-serif' }}>
              12+
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">Країн присутності</p>
          </div>
          
          <div className="text-center p-4 sm:p-5 md:p-6 bg-zinc-900/30 border border-zinc-800 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2" style={{ fontFamily: 'Eurostile, sans-serif' }}>
              97%
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">Задоволених клієнтів</p>
          </div>
          
          <div className="text-center p-4 sm:p-5 md:p-6 bg-zinc-900/30 border border-zinc-800 rounded-lg sm:rounded-xl">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2" style={{ fontFamily: 'Eurostile, sans-serif' }}>
              5+
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">Років на ринку</p>
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
