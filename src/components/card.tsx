"use client";
import { cn } from "~/lib/client/utils";

export default function Card({children, className} : {children: React.ReactNode, className: string}) {
    return (
        <div className={cn("h-[70px] bg-card px-4 rounded-xl", className)}>
            {children}
        </div>
    )
}