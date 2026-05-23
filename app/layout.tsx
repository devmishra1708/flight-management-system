import "./globals.css";

import type { Metadata } from "next";

import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Flight Management",
  description: "Flight booking system",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}
      </body>
    </html>
  );
}