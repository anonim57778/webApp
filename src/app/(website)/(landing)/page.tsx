"use client";

import { api } from "~/trpc/main/react";
import LoadingPage from "~/app/loading";

export default function LandingPage() {
  // Получаем информацию о пользователе
  const [session] = api.user.session.useSuspenseQuery();

  // Получаем информацию о всех тестах
  const { data: tests, isLoading } = api.test.getAll.useQuery();

  // Показываем загрузку, если ждем результатов от сервера
  if (isLoading || !tests || !session) return <LoadingPage />;

  return (
    <div className="grow flex flex-col items-center justify-center gap-12 container">
      <p className="text-2xl">Привет, {session.firstName}!</p>
      <div className="py-4 space-y-4">
        {tests.map((t) => (
          <div className="space-y-2">
            <p className="font-semibold">{t.name}</p>
            <p className="whitespace-pre-wrap">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
