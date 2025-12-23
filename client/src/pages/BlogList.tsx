import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Calendar, Eye, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";

export default function BlogList() {
  const { data: blogData, isLoading } = trpc.blog.list.useQuery({ limit: 50, offset: 0 });

  return (
    <>
      <Helmet>
        <title>Блог про маркетинг | PikaLeads</title>
        <meta name="description" content="Актуальні інсайти, гайди та кейси з performance-маркетингу. Ділимося досвідом та стратегіями, які працюють." />
      </Helmet>

      <CyberpunkNavigation currentPath="/blog" />

      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-purple-900/30 to-yellow-900/30 border border-yellow-400/20 rounded-full">
              <span className="text-yellow-400 text-xs md:text-sm font-semibold tracking-wider uppercase">
                📚 База знань
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'Eurostile, sans-serif' }}>
              <span className="text-white">БЛОГ ПРО </span>
              <span className="text-yellow-400" style={{ textShadow: '0 0 30px rgba(255,217,61,0.5)' }}>МАРКЕТИНГ</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
              Актуальні інсайти, гайди та кейси з performance-маркетингу. 
              Ділимося досвідом та стратегіями, які працюють.
            </p>
          </div>

          {/* Blog Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Завантаження...</p>
            </div>
          ) : blogData && blogData.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {blogData.posts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div
                    className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400/40 hover:shadow-[0_0_30px_rgba(255,217,61,0.15)] transition-all duration-300 cursor-pointer h-full flex flex-col"
                  >
                    {/* Cover Image */}
                    {post.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60"></div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("uk-UA") : ""}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views || 0}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300" style={{ fontFamily: 'Eurostile, sans-serif' }}>
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                        Читати далі
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, rgba(255,217,61,0.1) 0%, transparent 70%)`
                      }}
                    ></div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Статей поки немає</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
