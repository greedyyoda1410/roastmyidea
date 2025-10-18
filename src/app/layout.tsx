import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoastMyIdea.AI - AI Hackathon Judge Simulator",
  description: "Get your startup idea roasted by AI judges with personality, humor, and real critique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-terminal">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
