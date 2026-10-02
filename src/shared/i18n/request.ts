import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import ru from "./messages/ru.json";
import en from "./messages/en.json";

export default getRequestConfig(async () => {
  const preference = (await cookies()).get("portfolio-locale")?.value;
  const locale = preference === "en" ? "en" : "ru";

  return {
    locale,
    messages: locale === "en" ? en : ru,
  };
});
