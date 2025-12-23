import { Users, Linkedin, Facebook, Instagram, Send, Award } from "lucide-react";
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
    return null; // Don't show section if no team members
  }

  return (
    <section className="relative py-20 bg-black overflow-hidden">
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
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00F0FF]/30 bg-black/50 backdrop-blur-sm mb-6">
            <Users className="w-4 h-4 text-[#00F0FF]" />
            <span className="text-[#00F0FF] text-sm font-mono tracking-wider uppercase">
              Наша команда
            </span>
          </div>
          
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4"
            style={{
              fontFamily: "'Eurostile Bold Extended', 'Nasalization', 'Rajdhani', sans-serif",
              letterSpacing: "0.05em"
            }}
          >
            ЕКСПЕРТИ З <span className="text-[#00F0FF]">РЕЗУЛЬТАТАМИ</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Сертифіковані спеціалісти з досвідом запуску 500+ успішних кампаній
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="group relative bg-gradient-to-br from-zinc-900/90 to-black/70 backdrop-blur-xl border border-[#00F0FF]/20 rounded-2xl overflow-hidden hover:border-[#00F0FF]/50 transition-all duration-300"
              style={{
                boxShadow: "0 0 40px rgba(0, 240, 255, 0.05)",
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Photo */}
              <div className="relative h-64 overflow-hidden">
                {member.photoUrl ? (
                  <img 
                    src={member.photoUrl} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/20 to-[#FFD93D]/20 flex items-center justify-center">
                    <Users className="w-24 h-24 text-[#00F0FF]/50" />
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Certifications Badge */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {member.metaBlueprintCertified === 1 && (
                    <div 
                      className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full border border-[#FFD93D]/50 flex items-center gap-1"
                      title="Meta Blueprint Certified"
                    >
                      <Award className="w-3 h-3 text-[#FFD93D]" />
                      <span className="text-xs text-[#FFD93D] font-mono">META</span>
                    </div>
                  )}
                  {member.googleAdsCertified === 1 && (
                    <div 
                      className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full border border-[#00F0FF]/50 flex items-center gap-1"
                      title="Google Ads Certified"
                    >
                      <Award className="w-3 h-3 text-[#00F0FF]" />
                      <span className="text-xs text-[#00F0FF] font-mono">GOOGLE</span>
                    </div>
                  )}
                  {member.tiktokCertified === 1 && (
                    <div 
                      className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full border border-purple-400/50 flex items-center gap-1"
                      title="TikTok Certified"
                    >
                      <Award className="w-3 h-3 text-purple-400" />
                      <span className="text-xs text-purple-400 font-mono">TIKTOK</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 
                  className="text-xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {member.name}
                </h3>
                <p className="text-[#00F0FF] text-sm font-mono mb-2">
                  {member.position}
                </p>
                
                {member.experience && (
                  <p className="text-gray-400 text-sm mb-3">
                    {member.experience}
                  </p>
                )}

                {member.bio && (
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                )}

                {/* Social Links */}
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                  {member.linkedinUrl && (
                    <a 
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-[#0077B5] flex items-center justify-center transition-colors duration-300"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                    </a>
                  )}
                  {member.facebookUrl && (
                    <a 
                      href={member.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-[#1877F2] flex items-center justify-center transition-colors duration-300"
                      title="Facebook"
                    >
                      <Facebook className="w-4 h-4 text-white" />
                    </a>
                  )}
                  {member.instagramUrl && (
                    <a 
                      href={member.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] flex items-center justify-center transition-all duration-300"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4 text-white" />
                    </a>
                  )}
                  {member.telegramUrl && (
                    <a 
                      href={member.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-[#0088cc] flex items-center justify-center transition-colors duration-300"
                      title="Telegram"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </a>
                  )}
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at center, rgba(0, 240, 255, 0.1), transparent 70%)"
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
            transform: translateY(30px);
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
