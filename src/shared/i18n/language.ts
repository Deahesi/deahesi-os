export type Language = "ru" | "en";

export const setLanguage = (language: Language) => {
  document.cookie = `portfolio-locale=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
  window.localStorage.setItem("portfolio-language", language);
};
