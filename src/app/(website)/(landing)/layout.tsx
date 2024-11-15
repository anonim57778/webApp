"use client";

import Navbar from "./navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 size-full">
      <div className="grow flex flex-col pt-6 pb-4 overflow-y-scroll touch-pan-y">
        {children}
      </div>
      <Navbar />
    </div>
  );
}
