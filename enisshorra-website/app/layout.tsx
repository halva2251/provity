import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enis Shorra",
  description: "Personal website of Enis Shorra",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black text-black dark:text-white">
        {children}
      </body>
    </html>
  );
}
