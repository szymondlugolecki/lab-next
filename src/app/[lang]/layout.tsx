import "@/components/styles/globals.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Lab",
  description: "Medicine and Science. Personal Blog.",
};

export const runtime = "edge";

export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={fontSans.variable}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-[100dvh] flex-col bg-background font-sans antialiased">
              <Header />

              {children}

              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>

        <Toaster />
      </body>
    </html>
  );
}
