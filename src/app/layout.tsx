import type { Metadata } from "next";
import { Alegreya, Roboto } from "next/font/google";
import "./globals.css";

// Alegreya is the display/heading face: an elegant literary serif with a
// wide weight range (400-900) and full Greek letterform support — most
// "elegant display" Google Fonts (Playfair Display, Cinzel, Cormorant...)
// only ship Latin/Cyrillic and silently fall back to a system font for
// Greek text, which is nearly everything on this site.
const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin", "greek"],
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "greek"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Eva Mandisa | Oriental Dance",
    template: "%s | Eva Mandisa",
  },
  description:
    "Eva Mandisa — internationally recognized Oriental dancer, instructor and competition judge based in Greece.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="el" className={`${alegreya.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-paper">{children}</body>
    </html>
  );
}
