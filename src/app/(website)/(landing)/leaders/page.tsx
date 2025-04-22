"use client";
import { api } from "~/trpc/main/react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "~/components/ui/tabs"
import { useState } from "react";
import Timer from "~/components/timer";
import LeadersUsers from "~/components/leader-users";
import Card from "~/components/card";

export default function LeadersContestsPage() {
    //Получение и сортировка пользователей по балансу валюты
    const [leaders] = api.user.getLeaders.useSuspenseQuery();
    //Получение и сортировка пользователей по приглашенным пользователям с начала конкурса
    const [leadersContests] = api.user.getLeadersContest.useSuspenseQuery();
    //Получение текущего конкурса
    const [currentContest] = api.contest.get.useSuspenseQuery();
    //Получение текущего пользователяЫ
    const [session] = api.user.session.useSuspenseQuery();
    
    const [state, setState] = useState("leaders");
    const place = currentContest?.winners.find(winner => winner.userId === session.id)?.place ?? null;

    return (
        <div className="grow container">
            <Tabs defaultValue={state} onValueChange={setState} className="w-full h-full flex flex-col gap-y-6">
                {state == "leaders" ? (
                    <div className="flex flex-col text-center">
                        <h1 className="text-[32px] font-medium">🏆 Лидеры 🏆</h1>
                        <h1 className="text-2xl font-normal opacity-60">Нас 3.1 млн участников и<br/> ты один из них! Спасибо ❤️</h1>
                    </div>
                ) : (
                    <div className="flex flex-col text-center">
                        <h1 className="text-[32px] font-medium">🎉 Конкурс 🎉</h1>
                        <h1 className="text-2xl font-normal opacity-60">Зови друзей — собирай<br/> билеты! Награды ждут! 💸🔥</h1>
                    </div>
                )}
                <TabsList className="grid w-full grid-cols-2 bg-card gap-4 h-fit">
                    <TabsTrigger value="leaders" className="text-base font-medium">
                        Лидеры
                    </TabsTrigger>
                    <TabsTrigger value="contests" className="text-base font-medium">
                        Конкурс
                    </TabsTrigger>
                </TabsList>

                {state == "leaders" ? (
                    <Card className="flex items-center">
                        <div className="flex gap-4 items-center">
                            <img src={session.photoUrl ?? ""} className="size-12 rounded-full" alt="profile img"/>

                            <div className="flex flex-col gap-y-[2px]">
                                <h1 className="text-base font-normal">{session.firstName}</h1>
                                <h1 className="text-sm font-normal opacity-60">{session.gigaBalance} GIGACOIN</h1>
                            </div>
                        </div>
                    </Card>
                ) : (
                    currentContest?.status == "ACTIVE" ? (
                        <Card className="flex justify-center">
                            <div className="flex gap-4 items-center justify-center">
                                <Timer id={currentContest?.id ?? ""} timeRemaining={currentContest?.endDate ?? new Date()}/>
                            </div>
                        </Card>
                    ) : (
                        <Card className="flex items-center justify-center">
                            {place !== null ? (
                                <h1 className="text-base font-semibold text-center">Конкурс завершен, вы заняли #{place} место</h1>
                            ) : (
                                <h1 className="text-base font-semibold text-center">Конкурс завершен, вы не заняли<br/> призовое место</h1>
                            )}
                        </Card>
                    )
                )}

                <TabsContent className="grow" value="leaders">
                    <div className="h-full flex flex-col gap-y-4 overflow-y-auto">
                        <h1 className="text-xl font-medium">3.1M участников</h1>
                        <div className="grow flex flex-col gap-y-[2px]">
                            {leaders.map((leader, i) => (
                                <LeadersUsers key={i} name={leader.firstName} balance={leader.gigaBalance} image={leader.photoUrl ?? ""} position={i + 1} type="leaders"/>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent className="grow" value="contests">
                    {currentContest?.status == "ACTIVE" ? (
                        <div className="h-full flex flex-col gap-y-4 overflow-y-auto">
                            <h1 className="text-xl font-medium">3.1M участников</h1>
                            <div className="grow flex flex-col gap-y-[2px]">
                                {leadersContests?.map((leader, i) => (
                                    <LeadersUsers key={i} name={leader.firstName} friends={leader.inviters.length} image={leader.photoUrl ?? ""} position={i + 1} type="contests"/>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <h1 className="text-xl font-medium">Сейчас нет активного конкурса</h1>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}