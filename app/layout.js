import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import { fetchSettingsServer } from "@/lib/settings-server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const settings = await fetchSettingsServer();
  const title =
    settings?.siteTitle || "PureBD Mart - Your Trusted Online Marketplace";
  const description =
    settings?.siteDescription || "Shop the best products at PureBD Mart";
  const faviconFromApi = settings?.siteFavicon?.url;
  const favicon =
    faviconFromApi && faviconFromApi.toLowerCase().endsWith(".ico")
      ? faviconFromApi
      : "/favicon.ico";

  return {
    title,
    description,
    icons: {
      icon: favicon,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
