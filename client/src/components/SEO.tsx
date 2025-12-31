import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOProps {
  title: {
    uk: string;
    ru: string;
    en: string;
  };
  description: {
    uk: string;
    ru: string;
    en: string;
  };
  keywords?: {
    uk: string;
    ru: string;
    en: string;
  };
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  structuredData?: object;
}

export function SEO({
  title,
  description,
  keywords,
  ogImage = "https://pikaleadsquiz-eccrelaa.manus.space/og-image.png",
  ogType = "website",
  canonical,
  structuredData,
}: SEOProps) {
  const { language } = useLanguage();
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const currentTitle = title[language as keyof typeof title] || title.uk;
  const currentDescription = description[language as keyof typeof description] || description.uk;
  const currentKeywords = keywords?.[language as keyof typeof keywords] || "";

  // Language alternate URLs
  const alternateUrls = {
    uk: currentUrl.replace(/\/(ru|en)\//, "/uk/"),
    ru: currentUrl.replace(/\/(uk|en)\//, "/ru/"),
    en: currentUrl.replace(/\/(uk|ru)\//, "/en/"),
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={language} />
      <title>{currentTitle}</title>
      <meta name="description" content={currentDescription} />
      {currentKeywords && <meta name="keywords" content={currentKeywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={`${baseUrl}${canonical}`} />}

      {/* Language Alternates (hreflang) */}
      <link rel="alternate" hrefLang="uk" href={alternateUrls.uk} />
      <link rel="alternate" hrefLang="ru" href={alternateUrls.ru} />
      <link rel="alternate" hrefLang="en" href={alternateUrls.en} />
      <link rel="alternate" hrefLang="x-default" href={alternateUrls.uk} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={language === "uk" ? "uk_UA" : language === "ru" ? "ru_RU" : "en_US"} />
      <meta property="og:site_name" content="PIKALEADS" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={currentTitle} />
      <meta name="twitter:description" content={currentDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="PIKALEADS" />
      <meta name="theme-color" content="#7C3AED" />
    </Helmet>
  );
}
