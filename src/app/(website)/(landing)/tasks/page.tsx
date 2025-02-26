"use client";
import LoadingPage from "~/app/loading";
import { api } from "~/trpc/main/react";
import TaskCard from "./task-card";


export default function TasksPage() {
    const {data: tasks, isLoading} = api.task.getAllTasksUser.useQuery();

    if (isLoading) {
        return <LoadingPage/>
    }

    return (
        <div className="container grow flex flex-col space-y-6">
            <div className="text-center">
                <h1 className="text-[32px] font-medium">📋 Задания 📋</h1>
                <h1 className="text-2xl font-normal opacity-60 text-[#E5E5E5]">Получайте больше $GIGACOIN за выполнение заданий"</h1>
            </div>

            <div className="space-y-6 grow flex flex-col">
                <h1 className="text-xl font-medium">В игре</h1>
                {tasks?.length! > 0 ? (
                    <div className="flex flex-col gap-y-4">
                        {tasks?.map((item, i) => (
                            <TaskCard key={i} idTask={item.id} nameTask={item.name} reword={item.reword} typeReword={item.rewordType} status={item.status} chanelId={item.chanelId} amount={item.amount} done={item.done} completition={item.complete}/>
                        ))}
                    </div>
                ) : (
                    <div className="grow flex items-center justify-center">
                        <h1 className="text-base font-normal text-[#707579]">Здесь появяться задачи</h1>
                    </div>
                )}
            </div>
        </div>
    )
}