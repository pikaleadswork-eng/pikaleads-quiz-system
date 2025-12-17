// Schema.org structured data helpers for SEO

export interface Organization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  contactPoint?: {
    "@type": "ContactPoint";
    telephone?: string;
    contactType: string;
    email?: string;
    availableLanguage: string[];
  };
  sameAs?: string[];
}

export interface WebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

export interface Service {
  "@context": "https://schema.org";
  "@type": "Service";
  name: string;
  description: string;
  provider: {
    "@type": "Organization";
    name: string;
  };
  areaServed: string;
  serviceType: string;
}

export interface BreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export const createOrganizationSchema = (): Organization => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PIKALEADS",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@pikaleads.com",
      contactType: "Customer Service",
      availableLanguage: ["Ukrainian", "Russian", "English"],
    },
    sameAs: [
      // Add social media links here when available
    ],
  };
};

export const createWebSiteSchema = (): WebSite => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PIKALEADS",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
};

export const createServiceSchema = (
  name: string,
  description: string,
  serviceType: string
): Service => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "PIKALEADS",
    },
    areaServed: "Ukraine",
    serviceType,
  };
};

export const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): BreadcrumbList => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
};
