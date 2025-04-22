"use client";

import { api } from "~/trpc/main/react";
import Navbar from "./navbar";
import Unsubscribtion from "~/components/unsubscribtion";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [result] = api.user.checkSub.useSuspenseQuery();
  if (!result) {
    return <Unsubscribtion/>
  }
  return (
    <div className="flex flex-col gap-2 size-full">
      <div className="grow flex flex-col pt-6 pb-4 overflow-y-scroll touch-pan-y">
        {children}
      </div>
      <Navbar />
    </div>
  );
}