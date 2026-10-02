import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Pixelify_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { ApplicationStoreProvider } from "@/features/applications";
import { LocalePreference } from "@/shared/i18n/LocalePreference";
import "@/shared/styles/globals.css";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  icons: { icon: "/favicon.ico" },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${pixelifySans.variable} h-full antialiased`}>
      <body className={`${pixelifySans.className} min-h-full`}>
        <div className="min-h-screen flex flex-1 flex-col">
          <NextIntlClientProvider>
            <LocalePreference />
            <ApplicationStoreProvider>{children}</ApplicationStoreProvider>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
