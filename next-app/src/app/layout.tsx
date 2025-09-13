import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers/Providers";

export const metadata: Metadata = {
  title: "Game Editor",
  description: "A game editor built with Next.js and Fluent UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
