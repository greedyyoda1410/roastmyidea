import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoastMyIdea.AI - AI Hackathon Judge Simulator",
  description: "Get your startup idea roasted by 5 AI judges with distinct personalities. Real-time feedback with humor, sarcasm, and constructive critique powered by Google Gemini.",
  keywords: ["AI", "hackathon", "startup", "judge", "roast", "feedback", "idea validation", "pitch"],
  authors: [{ name: "RoastMyIdea Team" }],
  creator: "RoastMyIdea Team",
  publisher: "RoastMyIdea Team",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://roastmyidea.vercel.app",
    title: "RoastMyIdea.AI - AI Hackathon Judge Simulator",
    description: "Get your startup idea roasted by 5 AI judges with distinct personalities",
    siteName: "RoastMyIdea.AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoastMyIdea.AI - AI Hackathon Judge Simulator",
    description: "Get your startup idea roasted by 5 AI judges with distinct personalities",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-gameshow">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
