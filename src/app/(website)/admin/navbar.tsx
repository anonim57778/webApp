import { House, Users } from "lucide-react";
import type { ReactNode } from "react";
import NavbarItem from "../(landing)/navbar_item";

export type NavbarItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

const iconClassName = "size-6" as const;

// Сюда пишем новые страницы для админки
const navbarItems: NavbarItem[] = [
  {
    title: "Home",
    href: "/",
    icon: <House className={iconClassName} />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className={iconClassName} />,
  },
];

export default function Navbar() {
  return (
    <div className="items-center container px-4 py-2.5 flex flex-row justify-between">
      {navbarItems.map((item) => (
        <NavbarItem key={item.title} item={item} />
      ))}
    </div>
  );
}
