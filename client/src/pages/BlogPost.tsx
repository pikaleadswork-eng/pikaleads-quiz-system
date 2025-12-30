import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Calendar, Eye, ArrowLeft, Share2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";
import { toast } from "sonner";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug }, {
    enabled: !!slug,
  });

  const incrementViewsMutation = trpc.blog.incrementViews.useMutation();

  useEffect(() => {
    if (post && slug) {
      // Increment views after 3 seconds (to avoid counting bounces)
      const timer = setTimeout(() => {
        incrementViewsMutation.mutate({ slug });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [post, slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Посилання скопійовано!");
    }
  };

  if (isLoading) {
    return (
      <>
        <CyberpunkNavigation currentPath="/blog" />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Завантаження...</p>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <CyberpunkNavigation currentPath="/blog" />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Статтю не знайдено</h1>
            <Link href="/blog">
              <button className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors">
                Повернутися до блогу
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const seo = post.seo;

  return (
    <>
      <Helmet>
        <title>{seo?.metaTitle || post.title}</title>
        <meta name="description" content={seo?.metaDescription || post.excerpt} />
        {seo?.keywords && <meta name="keywords" content={seo.keywords} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={seo?.ogTitle || post.title} />
        <meta property="og:description" content={seo?.ogDescription || post.excerpt} />
        <meta property="og:image" content={seo?.ogImage || post.coverImage || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo?.ogTitle || post.title} />
        <meta name="twitter:description" content={seo?.ogDescription || post.excerpt} />
        <meta name="twitter:image" content={seo?.ogImage || post.coverImage || ""} />
      </Helmet>

      <CyberpunkNavigation currentPath="/blog" />

      <div className="min-h-screen bg-black text-white pt-20">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-[400px] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
          {/* Back Button */}
          <Link href="/blog">
            <button className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors mb-8">
              <ArrowLeft className="w-5 h-5" />
              Назад до блогу
            </button>
          </Link>

          {/* Article Content */}
          <article className="max-w-4xl mx-auto">
            {/* Title */}
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white"
              style={{ fontFamily: 'Eurostile, sans-serif' }}
            >
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }) : ""}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.views || 0} переглядів
              </div>
              {post.authorName && (
                <div className="flex items-center gap-2">
                  <span>Автор:</span>
                  <span className="text-yellow-400">{post.authorName}</span>
                </div>
              )}
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Поділитися
              </button>
            </div>

            {/* Content */}
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-white
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
                prose-li:text-gray-300 prose-li:mb-2
                prose-code:text-yellow-400 prose-code:bg-zinc-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:p-4
                prose-img:rounded-xl prose-img:my-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-16 p-8 bg-gradient-to-r from-purple-900/20 to-yellow-900/20 border border-yellow-400/20 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Потрібна консультація?</h3>
            <p className="text-gray-400 mb-6">
              Ми допоможемо впровадити ці стратегії у ваш бізнес
            </p>
            <Link href="/">
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,217,61,0.5)] transition-all duration-300">
                Отримати консультацію
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
