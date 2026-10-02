"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { setLanguage } from "./language";

export const LocalePreference = () => {
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (document.cookie.split("; ").some((item) => item.startsWith("portfolio-locale="))) return;
    if (window.localStorage.getItem("portfolio-language") !== "en" || locale === "en") return;

    setLanguage("en");
    router.refresh();
  }, [locale, router]);

  return null;
};
