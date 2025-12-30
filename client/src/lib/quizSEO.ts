// SEO data for quiz pages by niche and platform

interface QuizSEOData {
  title: { uk: string; ru: string; en: string };
  description: { uk: string; ru: string; en: string };
  keywords: { uk: string; ru: string; en: string };
}

export const getQuizSEO = (niche: string, platform: string): QuizSEOData => {
  const seoData: Record<string, Record<string, QuizSEOData>> = {
    furniture: {
      meta_ads: {
        title: {
          uk: "Реклама меблів у Meta Ads | Збільште продажі на 300% | PIKALEADS",
          ru: "Реклама мебели в Meta Ads | Увеличьте продажи на 300% | PIKALEADS",
          en: "Furniture Advertising in Meta Ads | Increase Sales by 300% | PIKALEADS",
        },
        description: {
          uk: "Запускаємо Meta рекламу для меблевих компаній з фокусом на заявки та продажі. Професійне налаштування Facebook та Instagram реклами для меблевого бізнесу. Безкоштовна консультація.",
          ru: "Запускаем Meta рекламу для мебельных компаний с фокусом на заявки и продажи. Профессиональная настройка рекламы Facebook и Instagram для мебельного бизнеса. Бесплатная консультация.",
          en: "Launch Meta advertising for furniture companies focused on leads and sales. Professional Facebook and Instagram advertising setup for furniture business. Free consultation.",
        },
        keywords: {
          uk: "реклама меблів, meta ads меблі, facebook реклама меблів, instagram реклама меблів, таргетована реклама меблів, просування меблевого магазину, реклама меблевої компанії, онлайн реклама меблів",
          ru: "реклама мебели, meta ads мебель, facebook реклама мебели, instagram реклама мебели, таргетированная реклама мебели, продвижение мебельного магазина, реклама мебельной компании, онлайн реклама мебели",
          en: "furniture advertising, meta ads furniture, facebook furniture ads, instagram furniture ads, targeted furniture advertising, furniture store promotion, furniture company ads, online furniture marketing",
        },
      },
      google_ads: {
        title: {
          uk: "Google Ads для меблів | Клієнти з пошуку | PIKALEADS",
          ru: "Google Ads для мебели | Клиенты из поиска | PIKALEADS",
          en: "Google Ads for Furniture | Clients from Search | PIKALEADS",
        },
        description: {
          uk: "Налаштовуємо Google рекламу для меблевого бізнесу з фокусом на реальних клієнтах з пошуку. Search і Shopping кампанії для меблевих компаній. Безкоштовна консультація.",
          ru: "Настраиваем Google рекламу для мебельного бизнеса с фокусом на реальных клиентах из поиска. Search и Shopping кампании для мебельных компаний. Бесплатная консультация.",
          en: "Set up Google advertising for furniture business focused on real clients from search. Search and Shopping campaigns for furniture companies. Free consultation.",
        },
        keywords: {
          uk: "google ads меблі, google реклама меблів, пошукова реклама меблів, google shopping меблі, контекстна реклама меблів, просування меблів google, реклама меблевого магазину google",
          ru: "google ads мебель, google реклама мебели, поисковая реклама мебели, google shopping мебель, контекстная реклама мебели, продвижение мебели google, реклама мебельного магазина google",
          en: "google ads furniture, google furniture advertising, search ads furniture, google shopping furniture, contextual furniture ads, furniture google promotion, furniture store google ads",
        },
      },
    },
    renovation: {
      meta_ads: {
        title: {
          uk: "Реклама ремонту квартир у Meta Ads | Стабільні заявки | PIKALEADS",
          ru: "Реклама ремонта квартир в Meta Ads | Стабильные заявки | PIKALEADS",
          en: "Apartment Renovation Ads in Meta Ads | Stable Leads | PIKALEADS",
        },
        description: {
          uk: "Беремо Meta рекламу для ремонту квартир під контроль: заявки, стабільність, масштаб. Професійне налаштування Facebook та Instagram реклами для будівельних компаній. Безкоштовна консультація.",
          ru: "Берем Meta рекламу для ремонта квартир под контроль: заявки, стабильность, масштаб. Профессиональная настройка рекламы Facebook и Instagram для строительных компаний. Бесплатная консультация.",
          en: "Take control of Meta advertising for apartment renovation: leads, stability, scale. Professional Facebook and Instagram advertising setup for construction companies. Free consultation.",
        },
        keywords: {
          uk: "реклама ремонту, meta ads ремонт, facebook реклама ремонту, instagram реклама ремонту, таргетована реклама ремонту, просування ремонтної компанії, реклама будівельних робіт, онлайн реклама ремонту",
          ru: "реклама ремонта, meta ads ремонт, facebook реклама ремонта, instagram реклама ремонта, таргетированная реклама ремонта, продвижение ремонтной компании, реклама строительных работ, онлайн реклама ремонта",
          en: "renovation advertising, meta ads renovation, facebook renovation ads, instagram renovation ads, targeted renovation advertising, renovation company promotion, construction work ads, online renovation marketing",
        },
      },
      google_ads: {
        title: {
          uk: "Google Ads для ремонту квартир | Заявки з пошуку | PIKALEADS",
          ru: "Google Ads для ремонта квартир | Заявки из поиска | PIKALEADS",
          en: "Google Ads for Apartment Renovation | Leads from Search | PIKALEADS",
        },
        description: {
          uk: "Налаштовуємо Google рекламу для ремонтних компаній з фокусом на реальних заявках з пошуку. Search кампанії для будівельного бізнесу. Безкоштовна консультація.",
          ru: "Настраиваем Google рекламу для ремонтных компаний с фокусом на реальных заявках из поиска. Search кампании для строительного бизнеса. Бесплатная консультация.",
          en: "Set up Google advertising for renovation companies focused on real leads from search. Search campaigns for construction business. Free consultation.",
        },
        keywords: {
          uk: "google ads ремонт, google реклама ремонту, пошукова реклама ремонту, контекстна реклама ремонту, просування ремонту google, реклама ремонтної компанії google, google ads будівництво",
          ru: "google ads ремонт, google реклама ремонта, поисковая реклама ремонта, контекстная реклама ремонта, продвижение ремонта google, реклама ремонтной компании google, google ads строительство",
          en: "google ads renovation, google renovation advertising, search ads renovation, contextual renovation ads, renovation google promotion, renovation company google ads, google ads construction",
        },
      },
    },
    ecommerce: {
      meta_ads: {
        title: {
          uk: "Реклама інтернет-магазину у Meta Ads | Продажі та окупність | PIKALEADS",
          ru: "Реклама интернет-магазина в Meta Ads | Продажи и окупаемость | PIKALEADS",
          en: "E-commerce Advertising in Meta Ads | Sales and ROI | PIKALEADS",
        },
        description: {
          uk: "Запускаємо Meta рекламу для e-commerce з фокусом на продажі та окупність, а не охоплення. Професійне налаштування Facebook та Instagram реклами для інтернет-магазинів. Безкоштовна консультація.",
          ru: "Запускаем Meta рекламу для e-commerce с фокусом на продажи и окупаемость, а не охват. Профессиональная настройка рекламы Facebook и Instagram для интернет-магазинов. Бесплатная консультация.",
          en: "Launch Meta advertising for e-commerce focused on sales and ROI, not reach. Professional Facebook and Instagram advertising setup for online stores. Free consultation.",
        },
        keywords: {
          uk: "реклама інтернет магазину, meta ads ecommerce, facebook реклама магазину, instagram реклама магазину, таргетована реклама онлайн магазину, просування інтернет магазину, реклама товарів facebook, онлайн продажі реклама",
          ru: "реклама интернет магазина, meta ads ecommerce, facebook реклама магазина, instagram реклама магазина, таргетированная реклама онлайн магазина, продвижение интернет магазина, реклама товаров facebook, онлайн продажи реклама",
          en: "online store advertising, meta ads ecommerce, facebook store ads, instagram store ads, targeted online store advertising, online store promotion, facebook product ads, online sales advertising",
        },
      },
      google_ads: {
        title: {
          uk: "Google Ads для інтернет-магазину | Продажі з пошуку | PIKALEADS",
          ru: "Google Ads для интернет-магазина | Продажи из поиска | PIKALEADS",
          en: "Google Ads for E-commerce | Sales from Search | PIKALEADS",
        },
        description: {
          uk: "Налаштовуємо Search і Shopping рекламу з контролем окупності та масштабом продажів для інтернет-магазинів. Google реклама для e-commerce. Безкоштовна консультація.",
          ru: "Настраиваем Search и Shopping рекламу с контролем окупаемости и масштабом продаж для интернет-магазинов. Google реклама для e-commerce. Бесплатная консультация.",
          en: "Set up Search and Shopping advertising with ROI control and sales scale for online stores. Google advertising for e-commerce. Free consultation.",
        },
        keywords: {
          uk: "google ads інтернет магазин, google shopping, пошукова реклама магазину, google merchant center, контекстна реклама ecommerce, просування магазину google, google ads онлайн продажі",
          ru: "google ads интернет магазин, google shopping, поисковая реклама магазина, google merchant center, контекстная реклама ecommerce, продвижение магазина google, google ads онлайн продажи",
          en: "google ads online store, google shopping, search ads store, google merchant center, contextual ecommerce ads, store google promotion, google ads online sales",
        },
      },
    },
    // Add more niches as needed...
  };

  const key = `${niche}_${platform}`;
  return seoData[niche]?.[platform] || {
    title: {
      uk: "PIKALEADS - Професійна реклама для вашого бізнесу",
      ru: "PIKALEADS - Профессиональная реклама для вашего бизнеса",
      en: "PIKALEADS - Professional Advertising for Your Business",
    },
    description: {
      uk: "Запускаємо ефективну рекламу з фокусом на реальний результат",
      ru: "Запускаем эффективную рекламу с фокусом на реальный результат",
      en: "Launch effective advertising focused on real results",
    },
    keywords: {
      uk: "реклама, таргетована реклама, meta ads, google ads",
      ru: "реклама, таргетированная реклама, meta ads, google ads",
      en: "advertising, targeted advertising, meta ads, google ads",
    },
  };
};
