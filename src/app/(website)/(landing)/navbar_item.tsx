"use client";

import Link from "~/components/ui/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/client/utils";
import type { NavbarItem } from "./navbar";

export default function NavbarItem({
  item,
}: {
  item: NavbarItem;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col text-sm items-center justify-center",
        pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href))
          ? "opacity-100"
          : "opacity-60",
      )}
    >
      {item.icon}
      <span>{item.title}</span>
    </Link>
  );
}
