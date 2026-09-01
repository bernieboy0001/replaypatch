import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "ReplayPatch — Bug video → Pull Request",
  description:
    "Upload a screen recording of a bug. ReplayPatch turns it into a failing Playwright test, fixes the code, proves the fix — and records every step on 0G Chain.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}