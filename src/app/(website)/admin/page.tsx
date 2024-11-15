import { redirect } from "next/navigation";

export default function AdminPage() {
  // Перенаправляем на страницу с тестами
  redirect("/admin/test");
}
