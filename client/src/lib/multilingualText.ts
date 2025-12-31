/**
 * Helper functions for handling multilingual text in quiz editor
 */

export type MultilingualText = {
  uk?: string;
  ru?: string;
  en?: string;
  pl?: string;
  de?: string;
};

export type SupportedLanguage = "uk" | "ru" | "en" | "pl" | "de";

/**
 * Parse a string that might be JSON multilingual object or plain text
 */
export function parseMultilingualText(text: string | MultilingualText | undefined | null): MultilingualText {
  if (!text) {
    return { uk: "", ru: "", en: "", pl: "", de: "" };
  }
  
  // If already an object, return it
  if (typeof text === "object") {
    return text;
  }
  
  // Try to parse as JSON
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as MultilingualText;
    }
  } catch {
    // Not JSON, treat as plain text
  }
  
  // Plain text - use as Ukrainian default
  return { uk: text, ru: text, en: text, pl: text, de: text };
}

/**
 * Get text for specific language with fallback
 */
export function getTextForLanguage(
  text: string | MultilingualText | undefined | null,
  language: SupportedLanguage
): string {
  const parsed = parseMultilingualText(text);
  
  // Try requested language first
  if (parsed[language]) {
    return parsed[language]!;
  }
  
  // Fallback order: uk -> ru -> en -> any available
  const fallbackOrder: SupportedLanguage[] = ["uk", "ru", "en", "pl", "de"];
  for (const lang of fallbackOrder) {
    if (parsed[lang]) {
      return parsed[lang]!;
    }
  }
  
  return "";
}

/**
 * Convert multilingual object to JSON string for storage
 */
export function stringifyMultilingualText(text: MultilingualText): string {
  return JSON.stringify(text);
}

/**
 * Update one language in multilingual text
 */
export function updateLanguageText(
  original: string | MultilingualText | undefined | null,
  language: SupportedLanguage,
  newValue: string
): MultilingualText {
  const parsed = parseMultilingualText(original);
  return {
    ...parsed,
    [language]: newValue,
  };
}

/**
 * Parse answer options that might be multilingual
 */
export function parseMultilingualOptions(
  options: Array<{ text: string | MultilingualText; imageUrl?: string }> | undefined | null,
  language: SupportedLanguage
): Array<{ text: string; imageUrl?: string; originalText: string | MultilingualText }> {
  if (!options || !Array.isArray(options)) {
    return [];
  }
  
  return options.map(opt => ({
    text: getTextForLanguage(opt.text, language),
    imageUrl: opt.imageUrl,
    originalText: opt.text,
  }));
}
