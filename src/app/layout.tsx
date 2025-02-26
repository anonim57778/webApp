"use client";
import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useEffect, useState } from "react";
import { SetInitData, SetStartParam, TRPCReactProvider } from "~/trpc/main/react";
import LoadingPage from "./loading";
import {
  init,
  miniApp,
  retrieveLaunchParams,
  viewport,
} from "@telegram-apps/sdk-react";

const main_font = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-main",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <html
      lang="en"
      className={`${main_font.variable} font-main max-h-screen h-screen overflow-hidden`}
    >
      <body>
        <TRPCReactProvider>
          <NuqsAdapter >
            <WebsiteLayoutInner>
              <div className="flex flex-col bg-background w-screen touch-none max-h-screen h-screen overflow-hidden">
                {children}
              </div>
            </WebsiteLayoutInner>
          </NuqsAdapter>
          <Toaster position="top-center" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}

function WebsiteLayoutInner({
  children,

}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!window) return;
    init();
    miniApp.mount();
    viewport.mount();
    viewport.expand();

    const launchParams = retrieveLaunchParams();
    const { initDataRaw, startParam } = launchParams;
    if (initDataRaw) {
      SetInitData(initDataRaw);
      if (startParam) {
        SetStartParam(startParam);
      }
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return children;
}



