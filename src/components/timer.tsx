"use client";
import { useState, useEffect } from "react";
import { Hourglass } from "lucide-react";
import { api } from "~/trpc/main/react";

export default function Timer({timeRemaining, id} : {timeRemaining: Date, id: string}) {
  const updateContestStatus = api.contest.setStatus.useMutation();
  const createWinners = api.contest.createWinners.useMutation();

  const utils = api.useUtils();

  const [time, setTime] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const [countTo, setCountTo] = useState<Date | null>(timeRemaining);

  useEffect(() => {
    if (!countTo) return;

    const interval = setInterval(() => {
      const diff = countTo.getTime() - Date.now();

      if (diff <= 0) {
        // Таймер истек
        clearInterval(interval);
        handleTimerEnd();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [countTo]);

  const handleTimerEnd = async () => {
    try {
      // Создаем победителей
      await createWinners.mutateAsync();

      // Обновляем статус конкурса
      await updateContestStatus.mutateAsync({ id: id });

      // Сбрасываем таймер
      setTime(null);
      await utils.contest.get.invalidate();
    } catch (error) {
      console.error("Ошибка при обновлении статуса конкурса:", error);
    }
  };

  return (
    <>
      {time ? (
        <div className="flex gap-4 items-center">
          <Hourglass className="size-8"/>

          <div className="flex gap-2">
            <div className="text-center px-2">
              <h1 className="text-2xl font-semibold">{time.days}</h1>
              <h1 className="text-[9.25px] leading-3 opacity-60">Дней</h1>
            </div>
            <div className="text-center px-2">
              <h1 className="text-2xl font-semibold">{time.hours}</h1>
              <h1 className="text-[9.25px] leading-3 opacity-60">Часов</h1>
            </div>
            <div className="text-center px-2">
              <h1 className="text-2xl font-semibold">{time.minutes}</h1>
              <h1 className="text-[9.25px] leading-3 opacity-60">Минут</h1>
            </div>
            <div className="text-center px-2">
              <h1 className="text-2xl font-semibold">{time.seconds}</h1>
              <h1 className="text-[9.25px] leading-3 opacity-60">Секунд</h1>
            </div>
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )
      }
    </>
  );
}
