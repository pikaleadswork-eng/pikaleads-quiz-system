export interface QuizQuestion {
  question: string;
  options: string[];
}

export interface QuizConfig {
  id: string;
  title: string;
  subtitle: string;
  platform: "meta" | "google";
  niche: string;
  questions: QuizQuestion[];
}

export const quizzesMap: Record<string, QuizConfig> = {
  "meta-furniture": {
    id: "meta-furniture",
    title: "Want to Get 30+ Furniture Leads Daily?",
    subtitle: "Take a short quiz and we'll calculate your lead cost and strategy",
    platform: "meta",
    niche: "furniture",
    questions: [
      {
        question: "What exactly do you sell?",
        options: ["Kitchens", "Soft Furniture", "Wardrobes / Closets", "Case Furniture", "All of the Above"],
      },
      {
        question: "What's your average order value?",
        options: ["Up to $200", "$200–$700", "$700–$2000", "$2000+"],
      },
      {
        question: "What's your advertising budget?",
        options: ["Up to $500", "$500–$1500", "$1500–$3000", "$3000+"],
      },
      {
        question: "What's your main goal?",
        options: ["Leads", "Phone Calls", "Showroom Visits"],
      },
    ],
  },
  "meta-repair": {
    id: "meta-repair",
    title: "Get 5-15 Hot Leads Daily for Apartment Renovations",
    subtitle: "Complete the quiz to get your personalized marketing plan",
    platform: "meta",
    niche: "repair",
    questions: [
      {
        question: "What type of renovation do you offer?",
        options: ["Cosmetic", "Major Renovation", "Luxury Renovation", "Specific Work (walls, electrical, plumbing)"],
      },
      {
        question: "Average project cost?",
        options: ["Up to $1000", "$1000–$5000", "$5000–$15000", "$15000+"],
      },
      {
        question: "Your service area?",
        options: ["City", "Region", "Nationwide"],
      },
      {
        question: "Advertising goal?",
        options: ["Phone Calls", "Leads", "Contact Requests"],
      },
    ],
  },
  "meta-ecom": {
    id: "meta-ecom",
    title: "Want to Scale Your E-Commerce? Get 30-120 Leads Daily",
    subtitle: "Answer a few questions to discover your growth potential",
    platform: "meta",
    niche: "ecommerce",
    questions: [
      {
        question: "Store category?",
        options: ["Clothing", "Home Goods", "Electronics", "Beauty & Care", "Other"],
      },
      {
        question: "What's your average order value?",
        options: ["Up to $50", "$50–$150", "$150–$500", "$500+"],
      },
      {
        question: "What's your advertising budget?",
        options: ["Up to $500", "$500–$2000", "$2000–$5000", "$5000+"],
      },
      {
        question: "Do you have a sales funnel?",
        options: ["Yes, fully set up", "Partially set up", "No, need help", "Not sure"],
      },
    ],
  },
  "meta-products": {
    id: "meta-products",
    title: "Scale Your Product Sales with Meta Ads",
    subtitle: "Get a custom strategy for your product",
    platform: "meta",
    niche: "products",
    questions: [
      {
        question: "What product do you sell?",
        options: ["Physical Products", "Digital Products", "Services", "Subscription Products"],
      },
      {
        question: "Average product price?",
        options: ["Up to $50", "$50–$200", "$200–$500", "$500+"],
      },
      {
        question: "Have you run ads before?",
        options: ["Yes, successfully", "Yes, but no results", "No, first time", "Not sure"],
      },
      {
        question: "How many leads do you want daily?",
        options: ["10-30 leads", "30-50 leads", "50-100 leads", "100+ leads"],
      },
    ],
  },
  "meta-telegram": {
    id: "meta-telegram",
    title: "Get 200-1200 New Telegram Subscribers Weekly",
    subtitle: "Grow your Telegram channel with targeted advertising",
    platform: "meta",
    niche: "telegram",
    questions: [
      {
        question: "Channel type?",
        options: ["Business", "Analytics", "News", "Product Sales", "Other"],
      },
      {
        question: "What are your goals?",
        options: ["Subscribers", "Leads", "Sales", "Engagement"],
      },
      {
        question: "Your budget?",
        options: ["Up to $300", "$300–$1000", "$1000–$3000", "$3000+"],
      },
      {
        question: "Do you have competitors? (Optional)",
        options: ["Yes, I know them", "Yes, but not sure who", "No competitors", "Need help identifying"],
      },
    ],
  },
  "google-furniture": {
    id: "google-furniture",
    title: "Get Quality Furniture Leads from Google Ads",
    subtitle: "Answer a few questions for your custom Google Ads strategy",
    platform: "google",
    niche: "furniture",
    questions: [
      {
        question: "What do you sell?",
        options: ["Kitchens", "Soft Furniture", "Wardrobes / Closets", "Case Furniture", "All of the Above"],
      },
      {
        question: "Average order value?",
        options: ["Up to $200", "$200–$700", "$700–$2000", "$2000+"],
      },
      {
        question: "Delivery/service region?",
        options: ["City", "Region", "Nationwide", "International"],
      },
      {
        question: "Have you run Google campaigns before?",
        options: ["Yes, successfully", "Yes, but no results", "No, first time", "Not sure"],
      },
    ],
  },
  "google-repair": {
    id: "google-repair",
    title: "Get Renovation Leads from Google Search",
    subtitle: "Discover how Google Ads can grow your renovation business",
    platform: "google",
    niche: "repair",
    questions: [
      {
        question: "Type of renovation?",
        options: ["Cosmetic", "Major Renovation", "Luxury Renovation", "Specific Work"],
      },
      {
        question: "Average client budget?",
        options: ["Up to $1000", "$1000–$5000", "$5000–$15000", "$15000+"],
      },
      {
        question: "City/region?",
        options: ["Major City", "Mid-size City", "Small City", "Multiple Regions"],
      },
      {
        question: "Do you need calls or leads?",
        options: ["Phone Calls", "Form Leads", "Both", "Not sure"],
      },
    ],
  },
  "google-ecom": {
    id: "google-ecom",
    title: "Scale Your E-Commerce with Google Ads",
    subtitle: "Get more customers through Google Search and Shopping",
    platform: "google",
    niche: "ecommerce",
    questions: [
      {
        question: "Store category?",
        options: ["Clothing", "Home Goods", "Electronics", "Beauty & Care", "Other"],
      },
      {
        question: "Product description?",
        options: ["Single Product", "Product Line", "Multiple Categories", "Marketplace"],
      },
      {
        question: "Average margin?",
        options: ["Up to 20%", "20-40%", "40-60%", "60%+"],
      },
      {
        question: "Do you want Shopping Ads?",
        options: ["Yes, definitely", "Not sure what it is", "No, just Search", "Need consultation"],
      },
    ],
  },
  "google-products": {
    id: "google-products",
    title: "Sell More Products with Google Ads",
    subtitle: "Get a tailored Google Ads strategy for your products",
    platform: "google",
    niche: "products",
    questions: [
      {
        question: "What product?",
        options: ["Physical Products", "Digital Products", "Services", "Subscription Products"],
      },
      {
        question: "Average price?",
        options: ["Up to $50", "$50–$200", "$200–$500", "$500+"],
      },
      {
        question: "Do you have a website?",
        options: ["Yes, fully functional", "Yes, needs improvement", "No, need one", "Landing page only"],
      },
      {
        question: "Have you advertised before?",
        options: ["Yes, on Google", "Yes, on other platforms", "No, first time", "Not sure"],
      },
    ],
  },
  "google-telegram": {
    id: "google-telegram",
    title: "Grow Your Telegram Channel with Google Ads",
    subtitle: "Get targeted subscribers from Google Search and YouTube",
    platform: "google",
    niche: "telegram",
    questions: [
      {
        question: "What channel?",
        options: ["Business", "Analytics", "News", "Product Sales", "Other"],
      },
      {
        question: "Goal?",
        options: ["Subscribers", "Leads", "Sales", "Engagement"],
      },
      {
        question: "Budget?",
        options: ["Up to $300", "$300–$1000", "$1000–$3000", "$3000+"],
      },
      {
        question: "Competitors?",
        options: ["Yes, I know them", "Yes, but not sure who", "No competitors", "Need help identifying"],
      },
    ],
  },
};

export const quizzes: QuizConfig[] = Object.values(quizzesMap);
