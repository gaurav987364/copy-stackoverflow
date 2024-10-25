/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import "../styles/prism.css"
import React from "react";
// import { Inter, Space_Grotesk } from 'next/font/google'; // eslint-disable-next-line camelcase
import { ThemeProvider } from "@/context/ThemeProvider";

// Load fonts with type assertions
// export const inter = Inter({
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700', '800', '900'],
//   variable: '--font-inter',
// })

// export const spaceGrotesk = Space_Grotesk({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-spaceGrotesk',
// })

// loading metadata
export const metadata: Metadata = {
  title: "TechOverflow",
  description: "Welcome to TechOverflow, the premier platform for developers to ask questions, share knowledge, and collaborate on solutions. Inspired by the renowned StackOverflow, TechOverflow offers a seamless and intuitive interface where tech enthusiasts can dive into a vast repository of programming wisdom.",
  icons: { icon: '/assets/images/site-logo.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "primary-gradient",
          footerActionLink: 'primary-text-gradient hover:text-primary-500',
        },
      }}
    >
      <html lang="en">
        <body
        >
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
