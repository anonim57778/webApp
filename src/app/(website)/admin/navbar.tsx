import { House, Users, CircleDollarSign, Table2, List} from "lucide-react";
import type { ReactNode } from "react";
import NavbarItem from "../(landing)/navbar_item";

export type NavbarItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

const iconClassName = "size-5" as const;

// Сюда пишем новые страницы для админки
const navbarItems: NavbarItem[] = [
  {
    title: "Главная",
    href: "/",
    icon: <House className={iconClassName} />,
  },
  {
    title: "Пользователи",
    href: "/admin/users",
    icon: <Users className={iconClassName} />,
  },
  {
    title: "Задания",
    href: "/admin/tasks",
    icon: <List className={iconClassName} />,
  },
  {
    title: "Конкурсы",
    href: "/admin/contests",
    icon: <CircleDollarSign className={iconClassName} />,
  },
  {
    title: "Товары",
    href: "/admin/products",
    icon: <Table2 className={iconClassName} />,
  },
];

export default function Navbar() {
  return (
    <div className="items-center container px-2 py-2.5 flex flex-row justify-between">
      {navbarItems.map((item) => (
        <NavbarItem key={item.title} item={item} className="text-xs"/>
      ))}
    </div>
  );
}
