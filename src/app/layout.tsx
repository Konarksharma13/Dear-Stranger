import type { Metadata } from "next";
import { 
  Cormorant_Garamond,
  Caveat,
  Sacramento,
  Architects_Daughter,
  Reenie_Beanie,
  Shadows_Into_Light,
  Nothing_You_Could_Do,
  Inter
} from "next/font/google";
import "./globals.css";

// 1. Elegant Serif Font
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic", "normal"]
});

// 2. Readable UI Font
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"]
});

// 3. Various handwriting styles to make entries look like they were written by different strangers
const caveat = Caveat({
  variable: "--font-handwritten-0",
  subsets: ["latin"],
  weight: ["400", "700"]
});

const sacramento = Sacramento({
  variable: "--font-handwritten-1",
  subsets: ["latin"],
  weight: ["400"]
});

const architectsDaughter = Architects_Daughter({
  variable: "--font-handwritten-2",
  subsets: ["latin"],
  weight: ["400"]
});

const reenieBeanie = Reenie_Beanie({
  variable: "--font-handwritten-3",
  subsets: ["latin"],
  weight: ["400"]
});

const shadowsIntoLight = Shadows_Into_Light({
  variable: "--font-handwritten-4",
  subsets: ["latin"],
  weight: ["400"]
});

const nothingYouCouldDo = Nothing_You_Could_Do({
  variable: "--font-handwritten-5",
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Dear Stranger — A Page for You",
  description: "A quiet place on the internet. Read a handwritten letter from a stranger, or leave a page behind for someone you'll never meet. Pause, breathe, and feel just a little less alone.",
  keywords: ["Dear Stranger", "Mental Health", "Comfort", "Hope", "Peace", "Kindness", "Stranger Notes", "Library"],
  openGraph: {
    title: "Dear Stranger — A Page for You",
    description: "A quiet place on the internet. Read a handwritten letter from a stranger, or leave a page behind.",
    type: "website",
    locale: "en_US",
  }
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${inter.variable} 
        ${cormorant.variable} 
        ${caveat.variable} 
        ${sacramento.variable} 
        ${architectsDaughter.variable} 
        ${reenieBeanie.variable} 
        ${shadowsIntoLight.variable} 
        ${nothingYouCouldDo.variable}
        h-full antialiased
      `}
    >
      <body className="min-h-full flex flex-col bg-[#fbf9f4] text-[#2c2a29] selection:bg-[#dfd9cc] selection:text-[#1a1918]">
        {children}
      </body>
    </html>
  );
}
