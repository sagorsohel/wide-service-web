import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wide Service - Local Home & Technician Services Across Bangladesh",
  description:
    "Discover verified local experts for AC repair, plumbing, electrical, cleaning, and appliances. Real-time GPS distance calculation, direct 1-tap phone calls & WhatsApp booking.",
  keywords: [
    "Wide Service",
    "home services",
    "AC repair",
    "plumbing",
    "electrician",
    "cleaning service",
    "local technicians",
    "Bangladesh",
    "Rajshahi",
    "Dhaka",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#e0b328",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
