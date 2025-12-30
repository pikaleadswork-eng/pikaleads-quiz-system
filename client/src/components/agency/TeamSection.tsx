import { Users, Linkedin, Facebook, Instagram, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function TeamSection() {
  const { data: teamMembers, isLoading } = trpc.team.getAll.useQuery();

  if (isLoading) {
    return (
      <section className="relative py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="text-[#FFD93D]">Завантаження команди...</div>
        </div>
      </section>
    );
  }

  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <section className="relative py-12 md:py-20 bg-black overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4"
            style={{
              fontFamily: "'Eurostile Bold Extended', 'Nasalization', 'Rajdhani', sans-serif",
              letterSpacing: "0.05em"
            }}
          >
            ЕКСПЕРТИ З <span className="text-[#00F0FF]">РЕЗУЛЬТАТАМИ</span>
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Сертифіковані спеціалісти з досвідом запуску 500+ успішних кампаній
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="group relative bg-black rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#00F0FF]/50 transition-all duration-500"
              style={{
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
              }}
            >
              {/* Large Photo with Gradient Overlay */}
              <div className="relative h-80 md:h-96 overflow-hidden">
                {member.photoUrl ? (
                  <>
                    <img 
                      src={member.photoUrl} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Dark Gradient Overlay - from transparent to black */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black"
                      style={{
                        background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.9) 100%)"
                      }}
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/20 to-[#FFD93D]/20 flex items-center justify-center">
                    <Users className="w-24 h-24 text-[#00F0FF]/50" />
                  </div>
                )}
                
                {/* Certification Badges - Top Right */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  {member.metaBlueprintCertified === 1 && (
                    <div 
                      className="px-3 py-1.5 bg-black/90 backdrop-blur-md rounded-lg border border-[#FFD93D] flex items-center gap-2 shadow-lg"
                      style={{
                        boxShadow: "0 0 20px rgba(255, 217, 61, 0.4)"
                      }}
                      title="Meta Blueprint Certified"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FFD93D">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-xs text-[#FFD93D] font-bold tracking-wider">META</span>
                    </div>
                  )}
                  {member.googleAdsCertified === 1 && (
                    <div 
                      className="px-3 py-1.5 bg-black/90 backdrop-blur-md rounded-lg border border-[#00F0FF] flex items-center gap-2 shadow-lg"
                      style={{
                        boxShadow: "0 0 20px rgba(0, 240, 255, 0.4)"
                      }}
                      title="Google Ads Certified"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#00F0FF">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                      </svg>
                      <span className="text-xs text-[#00F0FF] font-bold tracking-wider">GOOGLE</span>
                    </div>
                  )}
                  {member.tiktokCertified === 1 && (
                    <div 
                      className="px-3 py-1.5 bg-black/90 backdrop-blur-md rounded-lg border border-purple-400 flex items-center gap-2 shadow-lg"
                      style={{
                        boxShadow: "0 0 20px rgba(192, 132, 252, 0.4)"
                      }}
                      title="TikTok Certified"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#C084FC">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      <span className="text-xs text-purple-400 font-bold tracking-wider">TIKTOK</span>
                    </div>
                  )}
                </div>

                {/* Content Overlay - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  {/* Name */}
                  <h3 
                    className="text-2xl md:text-3xl font-black text-white mb-1 tracking-wide"
                    style={{ 
                      fontFamily: "'Rajdhani', sans-serif",
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)"
                    }}
                  >
                    {member.name.toUpperCase()}
                  </h3>
                  
                  {/* Position */}
                  <p 
                    className="text-[#00F0FF] text-sm md:text-base font-mono mb-2"
                    style={{
                      textShadow: "0 0 10px rgba(0, 240, 255, 0.5)"
                    }}
                  >
                    {member.position}
                  </p>
                  
                  {/* Experience */}
                  {member.experience && (
                    <p className="text-gray-300 text-sm mb-3">
                      {member.experience}
                    </p>
                  )}

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {member.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center gap-2">
                    {member.linkedinUrl && (
                      <a 
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-zinc-900/80 backdrop-blur-sm hover:bg-[#0077B5] flex items-center justify-center transition-all duration-300 border border-zinc-700 hover:border-[#0077B5] hover:scale-110"
                        style={{
                          boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)"
                        }}
                        title="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5 text-white" />
                      </a>
                    )}
                    {member.facebookUrl && (
                      <a 
                        href={member.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-zinc-900/80 backdrop-blur-sm hover:bg-[#1877F2] flex items-center justify-center transition-all duration-300 border border-zinc-700 hover:border-[#1877F2] hover:scale-110"
                        style={{
                          boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)"
                        }}
                        title="Facebook"
                      >
                        <Facebook className="w-5 h-5 text-white" />
                      </a>
                    )}
                    {member.instagramUrl && (
                      <a 
                        href={member.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-zinc-900/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] flex items-center justify-center transition-all duration-300 border border-zinc-700 hover:border-pink-500 hover:scale-110"
                        style={{
                          boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)"
                        }}
                        title="Instagram"
                      >
                        <Instagram className="w-5 h-5 text-white" />
                      </a>
                    )}
                    {member.telegramUrl && (
                      <a 
                        href={member.telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-zinc-900/80 backdrop-blur-sm hover:bg-[#0088cc] flex items-center justify-center transition-all duration-300 border border-zinc-700 hover:border-[#0088cc] hover:scale-110"
                        style={{
                          boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)"
                        }}
                        title="Telegram"
                      >
                        <Send className="w-5 h-5 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Neon Glow Effect on Hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.15), transparent 70%)",
                  boxShadow: "inset 0 0 60px rgba(0, 240, 255, 0.2)"
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
