"use client";

import { api } from "~/trpc/main/react";
import LoadingPage from "~/app/loading";
import gigachadLookAhead from "~/../public/images/gigachadLookAhead.png";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import Link from "~/components/ui/link";

export default function LandingPage() {
  const [session] = api.user.session.useSuspenseQuery();

  // Показываем загрузку, если ждем результатов от сервера
  if (!session) return <LoadingPage />;

  return (
    <div className="grow flex flex-col items-center justify-center gap-y-6 container">
      <div className="flex flex-col gap-y-4">
        <Image src={gigachadLookAhead} alt="gigachadLookAhead" className="rounded-full" width={200} height={200} />
        <div className="text-center font-medium pb-2 border-b border-b-secondary">
          <h1 className="text-[32px]">{session.gigaBalance}</h1>
          <h1 className="text-2xl opacity-60">$GIGACOIN</h1>
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-4">
        <Link href="/shop" className="w-full">
          <Button className="bg-primary w-full">Получить больше GIGACOINS</Button>
        </Link>

        {session.role == "ADMIN" && (
          <Link href="/admin/contests" className="w-full">
            <Button className="bg-secondary w-full">Админка</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
