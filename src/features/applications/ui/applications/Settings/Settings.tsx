import { motion } from "framer-motion";
import type { ChangeEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { setLanguage, type Language } from "@/shared/i18n/language";

export const Settings = () => {
  const language = useLocale();
  const t = useTranslations("ui");
  const router = useRouter();

  const handleLanguageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.currentTarget.value as Language);
    router.refresh();
  };

  return (
    <div className="flex min-h-full flex-col bg-background-window p-5 text-black md:p-8">
      <div className="border-b border-[#808080] pb-5">
        <h2 className="text-3xl">{t("settings")}</h2>
        <p className="mt-3 max-w-xl text-lg text-[#404040]">
          {t("languageDescription")}
        </p>
      </div>
      <fieldset className="mt-8 max-w-xl">
        <legend className="mb-4 text-xl">{t("language")}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["ru", "en"] as const).map((option) => (
            <label
              key={option}
              className="relative flex cursor-pointer items-center gap-3 border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] bg-[#c0c0c0] px-4 py-4 text-lg"
            >
              <input
                type="radio"
                name="language"
                value={option}
                checked={language === option}
                onChange={handleLanguageChange}
                className="size-5 accent-[#000080]"
              />
              {option === "ru" ? t("russian") : t("english")}
              {language === option && (
                <motion.span
                  layoutId="selected-language"
                  className="pointer-events-none absolute inset-0 border-2 border-dotted border-[#000080]"
                  transition={{ duration: 0.2 }}
                />
              )}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
};
