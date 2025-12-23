import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";

export default function CaseStudyPage() {
  const [, params] = useRoute("/case-studies/:slug");
  const slug = params?.slug || "";
  const { language } = useLanguage();

  const { data: caseStudy, isLoading } = trpc.caseStudies.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const content = {
    uk: {
      backToHome: "Назад на головну",
      loading: "Завантаження...",
      notFound: "Кейс не знайдено",
      views: "переглядів",
      results: "Результати",
      roi: "ROI",
      leads: "Лідів",
      roas: "ROAS",
      cpl: "CPL",
    },
    en: {
      backToHome: "Back to Home",
      loading: "Loading...",
      notFound: "Case study not found",
      views: "views",
      results: "Results",
      roi: "ROI",
      leads: "Leads",
      roas: "ROAS",
      cpl: "CPL",
    },
    ru: {
      backToHome: "Назад на главную",
      loading: "Загрузка...",
      notFound: "Кейс не найден",
      views: "просмотров",
      results: "Результаты",
      roi: "ROI",
      leads: "Лидов",
      roas: "ROAS",
      cpl: "CPL",
    },
  };

  const t = content[language as keyof typeof content] || content.uk;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-500">{t.loading}</div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{t.notFound}</h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToHome}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        {caseStudy.coverImage && (
          <div className="relative h-[60vh] overflow-hidden">
            <img
              src={caseStudy.coverImage}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>
        )}

        {/* Header Content */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container">
            <Link href="/">
              <Button
                variant="outline"
                className="mb-8 border-white/20 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToHome}
              </Button>
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {caseStudy.title}
            </h1>

            <div className="flex items-center gap-6 text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(caseStudy.publishedAt || caseStudy.createdAt).toLocaleDateString(language === 'uk' ? 'uk-UA' : language === 'ru' ? 'ru-RU' : 'en-US')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>
                  {caseStudy.viewCount} {t.views}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Client Info */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-zinc-500 uppercase mb-2">
                  Клієнт
                </h3>
                <p className="text-xl font-bold text-white">{caseStudy.client}</p>
              </div>
              {caseStudy.industry && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 uppercase mb-2">
                    Індустрія
                  </h3>
                  <p className="text-xl font-bold text-white">
                    {caseStudy.industry}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">
              {t.results}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {results.roi && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {results.roi}
                  </div>
                  <div className="text-sm text-zinc-400 uppercase">{t.roi}</div>
                </div>
              )}
              {results.leads && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {results.leads}
                  </div>
                  <div className="text-sm text-zinc-400 uppercase">
                    {t.leads}
                  </div>
                </div>
              )}
              {results.roas && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {results.roas}
                  </div>
                  <div className="text-sm text-zinc-400 uppercase">{t.roas}</div>
                </div>
              )}
              {results.cpl && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {results.cpl}
                  </div>
                  <div className="text-sm text-zinc-400 uppercase">{t.cpl}</div>
                </div>
              )}
            </div>
          </div>

          {/* Case Study Content */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-yellow-400
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-zinc-300 prose-p:leading-relaxed
              prose-ul:text-zinc-300 prose-li:my-2
              prose-strong:text-white prose-strong:font-semibold
              prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: caseStudy.content }}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
