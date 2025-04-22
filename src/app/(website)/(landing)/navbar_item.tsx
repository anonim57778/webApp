"use client";

import Link from "~/components/ui/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/client/utils";
import type { NavbarItem } from "./navbar";
import { api } from "~/trpc/main/react";

export default function NavbarItem({
  item,
  className
}: {
  item: NavbarItem;
  className?: string;
}) {
  const pathname = usePathname();
  const [session] = api.user.session.useSuspenseQuery();

  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col text-sm font-normal items-center justify-center",
        pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href))
          ? "opacity-100"
          : "opacity-60",
        session.role !== "ADMIN" && item.title == "admin" ? "hidden" : ""
      )}
    >
      {item.icon}
      <span className={className}>{item.title}</span>
    </Link>
  );
}
