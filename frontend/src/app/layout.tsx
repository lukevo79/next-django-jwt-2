import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Next Django JWT V2',
    template: '%s | Next Django JWT V2',
  },
  description: 'Next Django JWT V2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div 
          className="flex flex-col items-center justify-center h-screen max-w-[1480px] mx-auto"
        >
            {children}
        </div>
      </body>
    </html>
  );
}
