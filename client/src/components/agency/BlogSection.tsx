import { trpc } from "@/lib/trpc";
import { ArrowRight, Calendar, Eye } from "lucide-react";
import { Link } from "wouter";

export default function BlogSection() {
  const { data: blogData } = trpc.blog.list.useQuery({ limit: 4, offset: 0 });

  if (!blogData || blogData.posts.length === 0) {
    return null;
  }

  return (
    <section className="relative py-12 md:py-20 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08)_0%,transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,217,61,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,217,61,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 animate-fadeInUp">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-purple-900/30 to-yellow-900/30 border border-yellow-400/20 rounded-full">
            <span className="text-yellow-400 text-xs md:text-sm font-semibold tracking-wider uppercase">
              📚 База знань
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'Eurostile, sans-serif' }}>
            <span className="text-white">БЛОГ ПРО </span>
            <span className="text-yellow-400" style={{ textShadow: '0 0 30px rgba(255,217,61,0.5)' }}>МАРКЕТИНГ</span>
          </h2>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
            Актуальні інсайти, гайди та кейси з performance-маркетингу. 
            Ділимося досвідом та стратегіями, які працюють.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {blogData.posts.map((post, index) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div
                className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400/40 hover:shadow-[0_0_30px_rgba(255,217,61,0.15)] transition-all duration-300 cursor-pointer animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
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
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("uk-UA") : ""}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views || 0} переглядів
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300" style={{ fontFamily: 'Eurostile, sans-serif' }}>
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
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

        {/* View All Button */}
        <div className="text-center mt-12 md:mt-16 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <Link href="/blog">
            <button
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,217,61,0.5)] transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'Eurostile, sans-serif' }}
            >
              ВСІБЛОГ-СТАТТІ
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
