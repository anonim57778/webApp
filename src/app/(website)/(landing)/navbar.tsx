import { ChartColumn, House } from "lucide-react";
import type { ReactNode } from "react";
import NavbarItem from "./navbar_item";

export type NavbarItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

const iconClassName = "size-6" as const;

const navbarItems: NavbarItem[] = [
  {
    title: "home",
    href: "/",
    icon: <House className={iconClassName} />,
  },
  {
    title: "test",
    href: "/test",
    icon: <ChartColumn className={iconClassName} />,
  },
] as const;

export default function Navbar() {
  return (
    <div className="items-center container px-4 p-2.5 flex flex-row justify-between bg-background z-50">
      {navbarItems.map((item) => (
        <NavbarItem key={item.title} item={item} />
      ))}
    </div>
  );
}
