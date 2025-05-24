import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react"; 
import ClientBody from "./ClientBody"; 
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Wix Studio | The Web Platform Built for Agencies and Enterprises",
  description:
    "Deliver exceptional digital experiences in any industry with smart design, dev and management capabilities, built for agencies and enterprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="antialiased bg-theme-bg-primary text-theme-text-primary">
        <Suspense>
          <ClientBody>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ClientBody>
        </Suspense>
      </body>
    </html>
  );
}
