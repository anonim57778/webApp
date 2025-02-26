"use client";
import gigachadAgree from "~/../public/images/gigachadAgree.png";
import { api } from "~/trpc/main/react";
import FriendCard from "./friend-card";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "~/components/ui/drawer"
import { X } from "lucide-react";
import CopiLink from "~/components/copiLink";
import ShareLink from "~/components/shareLink";

export default function FriendsPage() {
    const [friends] = api.user.getFriends.useSuspenseQuery();

    return (
        <>
            <div className="grow container flex flex-col gap-y-6">
                <div className="h-full">
                    {friends.length > 0 ? (
                        <div className="space-y-4">
                            <h1 className="text-xl font-medium">Друзья</h1>
                            <div className="flex flex-col">
                                {friends.map((friend, i) => (
                                    <FriendCard key={i} id={friend.invite!.id} name={friend.invite!.firstName} image={friend.invite!.photoUrl ?? ""} balance={friend.invite!.gigaBalance}/>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center gap-y-4">
                            <Image src={gigachadAgree} className="rounded-b-full" alt="gigachad agree"/>

                            <div className="text-center">
                                <h1 className="text-[32px] font-medium">Друзья</h1>
                                <h1 className="text-2xl font-normal opacity-60">Пригласите своих друзей, чтобы получить 1000<br/> $GIGACOIN и 1 билет</h1>
                            </div>
                        </div>
                    )}
                </div>

                <Drawer>
                    <DrawerTrigger>
                        <Button className="w-full">
                            Пригласить друга
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader className="relative">
                            <DrawerTitle className="text-base font-semibold">Пригласить друга</DrawerTitle>
                            <DrawerClose className="absolute flex justify-center items-center top-[25%] size-7 rounded-full bg-white/5 right-2">
                                <X className="size-6 text-white/80"/>
                            </DrawerClose>
                        </DrawerHeader>

                        <div className="px-2 py-5 flex flex-col gap-y-4">
                            <CopiLink/>
                            <ShareLink/>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    )
}