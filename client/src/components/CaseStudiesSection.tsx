import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CaseStudiesSection() {
  const { language } = useLanguage();
  const { data: caseStudies, isLoading } = trpc.caseStudies.getPublished.useQuery({
    limit: 4,
  });

  const content = {
    uk: {
      title: "Наші результати",
      subtitle: "Реальні кейси з доказаними результатами",
      viewCase: "Детальніше",
      roi: "ROI",
      leads: "Лідів",
      roas: "ROAS",
      cpl: "CPL",
      loading: "Завантаження...",
    },
    en: {
      title: "Our Results",
      subtitle: "Real cases with proven results",
      viewCase: "View Case",
      roi: "ROI",
      leads: "Leads",
      roas: "ROAS",
      cpl: "CPL",
      loading: "Loading...",
    },
    ru: {
      title: "Наши результаты",
      subtitle: "Реальные кейсы с доказанными результатами",
      viewCase: "Подробнее",
      roi: "ROI",
      leads: "Лидов",
      roas: "ROAS",
      cpl: "CPL",
      loading: "Загрузка...",
    },
  };

  const t = content[language as keyof typeof content] || content.uk;

  if (isLoading) {
    return (
      <section className="py-20 bg-black">
        <div className="container">
          <div className="text-center text-zinc-500">{t.loading}</div>
        </div>
      </section>
    );
  }

  if (!caseStudies || caseStudies.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium text-sm uppercase tracking-wider">
              {t.title}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.subtitle}
          </h2>
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {caseStudies.map((caseStudy) => {
            let results = { roi: "", leads: "", roas: "", cpl: "" };
            let tags: string[] = [];

            try {
              results = JSON.parse(caseStudy.results || "{}");
            } catch (e) {
              console.error("Failed to parse results:", e);
            }

            try {
              tags = JSON.parse(caseStudy.tags || "[]");
            } catch (e) {
              console.error("Failed to parse tags:", e);
            }

            return (
              <div
                key={caseStudy.id}
                className="group bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10"
              >
                {/* Cover Image */}
                {caseStudy.coverImage && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={caseStudy.coverImage}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                  </div>
                )}

                <div className="p-8">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-medium bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title & Client */}
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {caseStudy.title}
                  </h3>
                  <p className="text-zinc-400 mb-4">{caseStudy.client}</p>
                  <p className="text-zinc-500 text-sm mb-6 line-clamp-2">
                    {caseStudy.description}
                  </p>

                  {/* Results Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/30 rounded-xl border border-zinc-800">
                    {results.roi && (
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">
                          {results.roi}
                        </div>
                        <div className="text-xs text-zinc-500 uppercase">
                          {t.roi}
                        </div>
                      </div>
                    )}
                    {results.leads && (
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">
                          {results.leads}
                        </div>
                        <div className="text-xs text-zinc-500 uppercase">
                          {t.leads}
                        </div>
                      </div>
                    )}
                    {results.roas && (
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">
                          {results.roas}
                        </div>
                        <div className="text-xs text-zinc-500 uppercase">
                          {t.roas}
                        </div>
                      </div>
                    )}
                    {results.cpl && (
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">
                          {results.cpl}
                        </div>
                        <div className="text-xs text-zinc-500 uppercase">
                          {t.cpl}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View Case Button */}
                  <Link href={`/case-studies/${caseStudy.slug}`}>
                    <Button
                      variant="outline"
                      className="w-full group/btn border-yellow-400/20 hover:bg-yellow-400 hover:text-black transition-all"
                    >
                      {t.viewCase}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
