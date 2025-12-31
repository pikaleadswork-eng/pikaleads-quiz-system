import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, DollarSign, Users } from "lucide-react";
import { Link } from "wouter";

interface MetaCaseStudiesSectionProps {
  pageSlug?: string;
}

export default function MetaCaseStudiesSection({ pageSlug = "meta-ads" }: MetaCaseStudiesSectionProps) {
  const { data: caseStudies } = trpc.caseStudies.getByPage.useQuery({ pageSlug });

  if (!caseStudies || caseStudies.length === 0) {
    return null;
  }

  const parseResults = (resultsJson: string) => {
    try {
      return JSON.parse(resultsJson);
    } catch {
      return {};
    }
  };

  const parseTags = (tagsJson: string) => {
    try {
      return JSON.parse(tagsJson);
    } catch {
      return [];
    }
  };

  return (
    <section id="cases" className="py-16 lg:py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container px-4 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Наші <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">кейси</span>
          </h2>
          <p className="text-xl text-gray-400">Реальні результати наших клієнтів</p>
        </div>

        {/* Case Studies Grid - Article Style */}
        <div className="space-y-12">
          {caseStudies.map((caseStudy: any, index: number) => {
            const results = parseResults(caseStudy.results);
            const tags = parseTags(caseStudy.tags);
            const isEven = index % 2 === 0;

            return (
              <article
                key={caseStudy.id}
                className={`group relative bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 border border-zinc-700 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-500 ${
                  isEven ? 'hover:shadow-orange-500/20' : 'hover:shadow-pink-500/20'
                } hover:shadow-2xl`}
              >
                <div className={`grid lg:grid-cols-2 gap-0 ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Image Side */}
                  <div className={`relative h-64 lg:h-auto ${!isEven ? 'lg:col-start-2' : ''}`}>
                    {caseStudy.coverImage ? (
                      <>
                        <img
                          src={caseStudy.coverImage}
                          alt={caseStudy.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-900/30 to-red-900/20 flex items-center justify-center">
                        <TrendingUp className="w-24 h-24 text-orange-500/30" />
                      </div>
                    )}
                  </div>

                  {/* Content Side */}
                  <div className="p-6 lg:p-10 flex flex-col justify-center">
                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-400 transition-all">
                      {caseStudy.title}
                    </h3>

                    {/* Client & Industry */}
                    <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
                      <span className="font-semibold text-cyan-400">{caseStudy.client}</span>
                      {caseStudy.industry && (
                        <>
                          <span>•</span>
                          <span>{caseStudy.industry}</span>
                        </>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-base lg:text-lg mb-6 leading-relaxed">
                      {caseStudy.description}
                    </p>

                    {/* Results Metrics */}
                    {Object.keys(results).length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                        {results.budget && (
                          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="w-4 h-4 text-green-400" />
                              <span className="text-xs text-gray-500 uppercase">Бюджет</span>
                            </div>
                            <div className="text-xl font-bold text-white">{results.budget}</div>
                          </div>
                        )}
                        {results.leads && (
                          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-4 h-4 text-cyan-400" />
                              <span className="text-xs text-gray-500 uppercase">Ліди</span>
                            </div>
                            <div className="text-xl font-bold text-white">{results.leads}</div>
                          </div>
                        )}
                        {results.roas && (
                          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="w-4 h-4 text-orange-400" />
                              <span className="text-xs text-gray-500 uppercase">ROAS</span>
                            </div>
                            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                              {results.roas}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CTA Button */}
                    <Link href={`/case-studies/${caseStudy.slug}`}>
                      <Button
                        variant="outline"
                        className="group/btn border-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 transition-all"
                      >
                        Читати повний кейс
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Button */}
        {caseStudies.length > 3 && (
          <div className="text-center mt-12">
            <Link href="/case-studies">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-6 text-lg font-bold"
              >
                Переглянути всі кейси
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
