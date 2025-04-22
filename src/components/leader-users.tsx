"use client";
import React from "react";
import { Calculate } from "./reword-calc";

export default function LeadersUsers({
  name,
  image,
  type,
  balance,
  friends,
  position,
}: {
  name: string;
  image: string;
  type: "leaders" | "contests";
  balance?: number;
  friends?: number;
  position: number;
}) {
  return (
    <div className="flex justify-between items-center py-3">
      {/* Левая часть - Аватар и текст */}
      <div className="flex gap-4 items-center">
        {/* Аватар */}
        <img
          src={image}
          className="size-12 rounded-full border-2"
          alt="user avatar"
        />
        {/* Имя и описание */}
        <div className="flex flex-col gap-y-[2px]">
          <h1 className="text-base font-medium text-white">{name}</h1>
          {type === "leaders" ? (
            <h1 className="text-sm font-normal opacity-35">
              {balance} GIGACOIN
            </h1>
          ) : (
            <h1 className="text-sm font-normal opacity-60">
              {friends} друзей | Место {position <= 3 ? (position === 1 ? "🥇" : position === 2 ? "🥈" : position === 3 ? "🥉" : null) : position}
            </h1>
          )}
        </div>
      </div>

      {/* Правая часть - Медаль/позиция */}
      <div className="flex items-center gap-2">
        {/* Медаль */}
        {type == "leaders" ? (
            position <= 3 ? (
              <span
                className={`text-xl ${
                  position === 1
                    ? "text-yellow-400"
                    : position === 2
                    ? "text-gray-400"
                    : "text-orange-400"
                }`}
              >
                {position === 1
                  ? "🥇"
                  : position === 2
                  ? "🥈"
                  : position === 3
                  ? "🥉"
                  : null}
              </span>
            ) : (
              // Позиция без медали
              <span className="text-sm font-bold text-gray-500">#{position}</span>
            )
        ) : (
            <div className="flex items-center gap-1">
                {position <= 3 ? (
                    <span
                      className="text-base font-normal"
                    >
                      {position === 1
                        ? Calculate(position, 10)
                        : position === 2
                        ? Calculate(position, 10)
                        : position === 3
                        ? Calculate(position, 10)
                        : null}
                    </span>
                  ) : (
                    // Позиция без медали
                    <span className="text-sm font-bold text-gray-500">#{position}</span>
                  )}
                <h1>🎟</h1>
            </div>
        )}
      </div>
    </div>
  );
}
