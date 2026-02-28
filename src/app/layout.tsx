import type { Metadata } from "next";
import { Noto_Serif_SC, Ma_Shan_Zheng } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const maShanZheng = Ma_Shan_Zheng({
  variable: "--font-mashan",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "墨韵成语 — 每日一语",
  description:
    "每天学习一个中国成语，感受汉语之美。包含成语释义、出处、例句，在水墨意境中品味中华文化。",
  keywords: ["成语", "中国文化", "每日成语", "汉语学习", "Chinese idioms"],
  openGraph: {
    title: "墨韵成语 — 每日一语",
    description: "每天学习一个中国成语，感受汉语之美",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${notoSerifSC.variable} ${maShanZheng.variable}`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
