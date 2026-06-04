import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const plusJakartaSans = localFont({
  src: [
    {
      path: "./fonts/PlusJakartaSans-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "./fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Ransa PQRS",
  description: "Peticiones, Quejas, Reconocimientos, Sugerencias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
