import "./globals.css";

export const metadata = {
  title: "ReplayPatch — Bug video → Pull Request",
  description:
    "Upload a screen recording of a bug. ReplayPatch turns it into a failing Playwright test, fixes the code, and proves the fix.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}
