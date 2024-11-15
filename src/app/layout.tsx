import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import TRPCReactProvider from "~/trpc/trpc_react_provider";

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
          <div className="pb-2 w-screen touch-none max-h-screen h-screen overflow-hidden">
            {children}
          </div>
          <Toaster position="top-center" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
