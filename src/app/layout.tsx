import type { Metadata } from "next";
import { Nunito, Baloo_2, DM_Sans, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WatchMeGuru.io — Stay accountable. Build discipline. Level up daily.",
  description: "An AI accountability companion that checks in daily, builds your study ecosystem, and alerts guardians when you go silent.",
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#7BA65B",
    colorTextOnPrimaryBackground: "#FDF9F0",
    colorBackground: "#FDF9F0",
    colorText: "#3D2E24",
    colorTextSecondary: "#6B5D52",
    colorInputBackground: "#FDF9F0",
    colorInputText: "#3D2E24",
    borderRadius: "14px",
    fontFamily: "var(--font-manrope), -apple-system, BlinkMacSystemFont, sans-serif",
  },
  elements: {
    card: {
      boxShadow: "none",
      border: "1.5px solid rgba(91,70,54,0.1)",
    },
    formButtonPrimary: {
      background: "linear-gradient(135deg, #D9A441, #C08A2E)",
      color: "#FDF9F0",
      fontWeight: "700",
      fontSize: "16px",
      padding: "14px 28px",
      borderRadius: "14px",
      transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
    },
    formFieldInput: {
      borderRadius: "14px",
      border: "1.5px solid rgba(91,70,54,0.15)",
      padding: "14px 16px",
      fontSize: "15px",
    },
    headerTitle: {
      fontWeight: "800",
      fontSize: "28px",
      letterSpacing: "-0.02em",
    },
    headerSubtitle: {
      color: "#6B5D52",
      fontSize: "14px",
    },
    footerActionLink: {
      color: "#7BA65B",
      fontWeight: "600",
    },
  },
};

import Providers from "./providers";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" className={`${nunito.variable} ${baloo.variable} ${dmSans.variable} ${manrope.variable} h-full`}>
        <body className="min-h-full overflow-x-hidden" style={{ fontFamily: "var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif" }}>
          <Providers>
            <LenisProvider>
              {children}
            </LenisProvider>
            <CustomCursor />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
