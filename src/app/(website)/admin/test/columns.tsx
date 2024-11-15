"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Test } from "~/lib/shared/types/test";
import CreateTest from "./create";

export const columns: ColumnDef<Test>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "description",
    header: "Активен",
  },
  {
    id: "actions",
    header: () => (
      <div className="flex items-center justify-end">
        <CreateTest />
      </div>
    ),

    cell({ row }) {
      const task = row.original;

      return (
        <div className="flex items-center justify-end">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" aria-haspopup="true">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <CreateTest />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
