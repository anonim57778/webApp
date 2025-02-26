"use client";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/main/react";
import gigachadSmile from "~/../public/images/gigachadSmile.png";
import Image from "next/image";

export default function TaskCard({
  idTask,
  nameTask,
  reword,
  typeReword,
  status,
  chanelId,
  amount,
  done,
  completition
}: {
  idTask: string;
  nameTask: string;
  reword: number;
  typeReword: string;
  status: boolean;
  chanelId: string | null;
  amount: number;
  done: number;
  completition: boolean;
}) {
    const utils = api.useUtils();
    const complteMutattion = api.task.takeTask.useMutation({
        onSuccess: () => {
            toast.success("Задание выполнено, награда получена");
            utils.task.getAllTasksUser.invalidate();
        }, 
        onError: (error) => {
            toast.error("Ошибка при выполнении задания");
        }
    })

    return (
        <div className="flex justify-between items-center py-2">

        <div className="flex gap-2 items-center">
            <Image src={gigachadSmile} alt="gigachadSmile" className="rounded-full border object-cover border-primary size-20" width={200} height={200} />
            <div className="flex flex-col gap-y-[2px] border-l border-l-primary pl-1">
                <h1 className="text-base font-normal text-white">{nameTask}</h1>

                <h1 className="text-sm font-normal text-[#707579]">
                    {reword} GIGACOIN
                </h1>
            </div>
        </div>

        {completition ? (
            <h1>Выполнено</h1>
        ) : (
            status ? (
                <Button onClick={() => complteMutattion.mutate({id: idTask})}>Получить</Button>
            ) : (
                <h1>Сделано {done}/{amount}</h1>
            )
        )}
        </div>
    );
}
