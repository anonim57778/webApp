"use client";
import React from "react";
import DeleteFriend from "./delete";

export default function FriendCard({
  id,
  name,
  image,
  balance,
}: {
  id: string;
  name: string;
  image: string;
  balance?: number;
}) {
  return (
    <div className="flex justify-between items-center py-3">

      <div className="flex gap-4 items-center">
        <img
          src={image}
          className="size-12 rounded-full border-2"
          alt="user avatar"
        />
        <div className="flex flex-col gap-y-[2px]">
          <h1 className="text-base font-medium text-white">{name}</h1>
            <h1 className="text-sm font-normal opacity-35">
              {balance} PEPE
            </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DeleteFriend id={id}/>
      </div>
    </div>
  );
}
