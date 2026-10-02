import ru from "./messages/ru.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof ru;
  }
}
