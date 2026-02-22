import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "@/components/auth/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "항공권 핫딜 트래커",
  description: "항공권 가격을 모니터링하고 핫딜을 알려드립니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
