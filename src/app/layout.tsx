import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { profile } from "@/lib/content";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: `${profile.name} · AI/ML Engineer`,
  description: `${profile.headline} Agentic systems, retrieval, multimodal research.`,
};

// Runs before first paint so there is no flash of the wrong theme.
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain min-h-screen">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
