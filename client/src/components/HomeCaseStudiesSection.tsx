import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { CyberpunkCard, GlitchText } from "@/components/cyberpunk";
import { ArrowRight } from "lucide-react";

const categories = [
  { id: "all", label: "Всі", labelRu: "Все" },
  { id: "google-ads", label: "Google Ads", labelRu: "Google Ads" },
  { id: "meta-ads", label: "Meta Ads", labelRu: "Meta Ads" },
  { id: "tiktok-ads", label: "TikTok Ads", labelRu: "TikTok Ads" },
  { id: "x-ads", label: "X (Twitter)", labelRu: "X (Twitter)" },
  { id: "telegram-ads", label: "Telegram", labelRu: "Telegram" },
  { id: "web-development", label: "Web Dev", labelRu: "Web Dev" },
  { id: "web-design", label: "Web Design", labelRu: "Web Design" },
  { id: "app-development", label: "App Dev", labelRu: "App Dev" },
];

interface HomeCaseStudiesSectionProps {
  language?: "uk" | "ru" | "en";
}

export default function HomeCaseStudiesSection({ language = "uk" }: HomeCaseStudiesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Load all published case studies
  const { data: allCaseStudies = [], isLoading } = trpc.caseStudies.getPublished.useQuery({ 
    limit: 100, 
    offset: 0 
  });
  
  // Filter case studies based on selected category
  const filteredCaseStudies = selectedCategory === "all" 
    ? allCaseStudies 
    : allCaseStudies.filter(caseStudy => {
        try {
          const pageVisibility = caseStudy.pageVisibility 
            ? JSON.parse(caseStudy.pageVisibility) 
            : [];
          return pageVisibility.includes(selectedCategory);
        } catch {
          return false;
        }
      });

  // Show only first 6 case studies
  const displayedCaseStudies = filteredCaseStudies.slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-20 relative">
        <div className="absolute inset-0 scan-lines opacity-5" />
        <div className="container relative z-10">
          <div className="text-center">
            <GlitchText variant="cyan" className="text-3xl">
              {language === "uk" ? "ЗАВАНТАЖЕННЯ..." : language === "ru" ? "ЗАГРУЗКА..." : "LOADING..."}
            </GlitchText>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 scan-lines opacity-5" />
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <GlitchText variant="cyan" className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Bungee, sans-serif' }}>
            {language === "uk" ? "КЕЙСИ ТА РЕЗУЛЬТАТИ" : language === "ru" ? "КЕЙСЫ И РЕЗУЛЬТАТЫ" : "CASE STUDIES & RESULTS"}
          </GlitchText>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === "uk" 
              ? "Реальні результати наших клієнтів у різних нішах та платформах" 
              : language === "ru" 
              ? "Реальные результаты наших клиентов в разных нишах и платформах"
              : "Real results from our clients across different niches and platforms"}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-base
                transition-all duration-300
                ${selectedCategory === category.id 
                  ? 'bg-[#FFD93D] text-black border-2 border-[#FFD93D]' 
                  : 'bg-black/50 text-white border-2 border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10'
                }
              `}
              style={{
                fontFamily: 'Bungee, sans-serif',
                boxShadow: selectedCategory === category.id 
                  ? '0 0 20px rgba(255, 217, 61, 0.4)' 
                  : 'none'
              }}
            >
              {language === "ru" ? category.labelRu : category.label}
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        {displayedCaseStudies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              {language === "uk" 
                ? "Кейси для цієї категорії незабаром з'являться" 
                : language === "ru" 
                ? "Кейсы для этой категории скоро появятся"
                : "Case studies for this category coming soon"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayedCaseStudies.map((caseStudy) => {
              // Parse results JSON
              let results: Record<string, string> = {};
              try {
                results = caseStudy.results ? JSON.parse(caseStudy.results) : {};
              } catch {
                results = {};
              }

              // Get first 3 results to display
              const resultEntries = Object.entries(results).slice(0, 3);

              return (
                <Link key={caseStudy.id} href={`/case-studies/${caseStudy.slug}`}>
                  <CyberpunkCard 
                    variant="purple" 
                    glow={true}
                    hover={true}
                    className="h-full flex flex-col cursor-pointer group overflow-hidden"
                  >
                    {/* Cover Image */}
                    {caseStudy.coverImage && (
                      <div className="relative w-full h-48 mb-4 -mx-6 -mt-6 overflow-hidden">
                        <img 
                          src={caseStudy.coverImage}
                          alt={caseStudy.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-3 text-[#FFD93D] group-hover:neon-glow-cyan transition-all" style={{ fontFamily: 'Bungee, sans-serif' }}>
                        {caseStudy.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400 mb-4">
                        {caseStudy.client} • {caseStudy.industry}
                      </p>

                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {caseStudy.description}
                      </p>

                      {/* Results */}
                      {resultEntries.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {resultEntries.map(([key, value]) => (
                            <div key={key} className="text-center p-2 bg-cyan-500/10 rounded border border-cyan-500/30">
                              <div className="text-lg font-bold text-[#FFD93D]">{value}</div>
                              <div className="text-xs text-gray-400 uppercase">{key}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      className="w-full mt-4 px-6 py-3 bg-transparent text-cyan-400 font-bold rounded-lg border-2 border-cyan-500/50 hover:bg-cyan-500/10 hover:border-cyan-500 transition-all"
                      style={{ fontFamily: 'Bungee, sans-serif' }}
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        {language === "uk" ? "ЧИТАТИ КЕЙС" : language === "ru" ? "ЧИТАТЬ КЕЙС" : "READ CASE"}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </button>
                  </CyberpunkCard>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {filteredCaseStudies.length > 6 && (
          <div className="text-center">
            <Link href="/case-studies">
              <button
                className="px-8 py-4 bg-[#FFD93D] text-black font-bold rounded-lg border-2 border-[#FFD93D] hover:bg-[#FFD93D]/90 transition-all"
                style={{
                  fontFamily: 'Bungee, sans-serif',
                  boxShadow: '0 0 20px rgba(255, 217, 61, 0.3)'
                }}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {language === "uk" ? "ПЕРЕГЛЯНУТИ ВСІ КЕЙСИ" : language === "ru" ? "ПОСМОТРЕТЬ ВСЕ КЕЙСЫ" : "VIEW ALL CASES"}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
