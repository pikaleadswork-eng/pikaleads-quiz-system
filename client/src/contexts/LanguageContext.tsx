import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";

export type Language = "uk" | "ru" | "en" | "pl" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith("uk")) return "uk";
  if (browserLang.startsWith("ru")) return "ru";
  if (browserLang.startsWith("pl")) return "pl";
  if (browserLang.startsWith("de")) return "de";
  
  return "en"; // default
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first
    const saved = localStorage.getItem("pikaleads_language");
    if (saved && ["uk", "ru", "en", "pl", "de"].includes(saved)) {
      return saved as Language;
    }
    // Auto-detect from browser
    return detectBrowserLanguage();
  });

  // Try to detect language from IP geolocation
  const { data: geoData } = trpc.auth.detectLanguage.useQuery(undefined, {
    enabled: !localStorage.getItem("pikaleads_language"),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (geoData && !localStorage.getItem("pikaleads_language")) {
      setLanguageState(geoData.language as Language);
    }
  }, [geoData]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("pikaleads_language", lang);
    // Sync with i18next
    i18n.changeLanguage(lang);
    // Dispatch event for other components
    window.dispatchEvent(new Event('languageChanged'));
  };
  
  // Initialize i18next with current language
  useEffect(() => {
    i18n.changeLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
