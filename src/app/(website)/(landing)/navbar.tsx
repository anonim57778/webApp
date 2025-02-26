import { House, ChartColumn, ClipboardList, Users } from "lucide-react";
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
    title: "Главная",
    href: "/",
    icon: <House className={iconClassName} />,
  },
  {
    title: "Лидеры",
    href: "/leaders",
    icon: <ChartColumn className={iconClassName} />,
  },
  {
    title: "Задания",
    href: "/tasks",
    icon: <ClipboardList className={iconClassName} />,
  },
  {
    title: "Друзья",
    href: "/friends",
    icon: <Users className={iconClassName} />,
  }
] as const;

export default function Navbar() {
  return (
    <div className="items-center container py-[9.5px] flex flex-row justify-between bg-primary rounded-t-md z-50">
      {navbarItems.map((item) => (
        <NavbarItem key={item.title} item={item} />
      ))}
    </div>
  );
}
