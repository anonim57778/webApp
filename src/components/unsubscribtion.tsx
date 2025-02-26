"use client";
import Image from "next/image";
import gigachadPosing from "~/../public/images/gigachadPosing.png";
import { Button } from "./ui/button";
import { api } from "~/trpc/main/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Unsubscribtion() {
  // Получаем данные о подписке с помощью useQuery
  const { isLoading, refetch } = api.user.checkSub.useQuery(undefined, {
    enabled: false, // Запрос будет выполнен только вручную через refetch
  });
  const router = useRouter();

  const check = async () => {
    try {
      const { data: res } = await refetch(); // Выполняем запрос вручную
      if (res) {
        toast.success("Подписка успешно проверена");
        router.push("/");
      } else {
        toast.error("Подписка не прошла проверку, попробуйте позже");
      }
    } catch (error) {
      console.error(error);
      toast.error("Произошла ошибка при проверке подписки");
    }
  };

  return (
    <div className="grow container flex flex-col justify-center">
      <div className="flex flex-col gap-y-6 items-center">
        <h1 className="text-2xl text-center font-medium">
          Чтобы воспользоваться ботом, подпишитесь на канал
        </h1>

        <Image src={gigachadPosing} className="rounded-full" alt="gigachadPosing" width={300} height={300} />

        <div className="flex w-full flex-col gap-y-4">
          <a className="w-full" href={"https://t.me/Atras2624"} target="_blank">
            <Button className="w-full">Подписаться на канал</Button>
          </a>
          <Button
            onClick={check}
            variant={"secondary"}
            disabled={isLoading} // Блокируем кнопку во время загрузки
          >
            {isLoading ? "Проверяем..." : "Проверить подписку"}
          </Button>
        </div>
      </div>
    </div>
  );
}
