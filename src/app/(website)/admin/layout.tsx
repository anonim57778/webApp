"use client";

import { notFound } from "next/navigation";
import type React from "react";
import LoadingPage from "~/app/loading";
import { api } from "~/trpc/main/react";
import Navbar from "./navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Получаем информацию о пользователе
  const { data: session, isLoading } = api.user.session.useQuery();

  // Выводим загрузку, если пользователь еще не получен
  if (isLoading) {
    return <LoadingPage />;
  }

  // Кидаем 404 ошибку, если пользователь не админ
  if (session?.role !== "ADMIN") {
    notFound();
  }

  // Выводим админку и навигацию
  return (
    <div className="flex flex-col gap-2 size-full">
      <div className="grow flex flex-col overflow-scroll">{children}</div>
      <Navbar />
    </div>
  );
}
