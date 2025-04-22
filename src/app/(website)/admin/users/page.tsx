"use client";
import { User } from "~/lib/shared/types/user";
import { api } from "~/trpc/main/react";


export default function UsersAdminPage() {

    const [users] = api.user.getAll.useSuspenseQuery({});

    function UserCard({ user }: { user: User }) {

        return (
            <div className="flex items-center gap-2 pb-2 border-b border-b-white/20">
                <div className="size-14">
                    <img src={user.photoUrl ?? ""} width={40} height={40} className="size-full rounded-full"/>
                </div>

                <div className="flex flex-col gap-y-1">
                    <h1 className="text-xl font-medium">{user.firstName} {user.lastName}</h1>

                    <h1 className="text-base font-normal">Баланс: {user.gigaBalance}</h1>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-y-4 container">
            <h1 className="text-2xl font-medium text-center">Пользователи</h1>

            <div className="flex flex-col gap-y-3">
                {users.map((user, i) => (
                    <UserCard key={i} user={user}/>
                ))}
            </div>
        </div>
    )
}