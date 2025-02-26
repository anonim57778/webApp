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
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { Task } from "~/lib/shared/types/task";
import CreateUpdateTask from "./create-update";
import DeleteTask from "./delete";


export const columns: ColumnDef<Task>[] = [
	{
		accessorKey: "name",
		header: "Название",
	},
    {
        accessorKey: "amount",
        header: "Количество",
    },
    {
		accessorKey: "creatadAt",
		header: "Дата создания",
        cell: ({ row }) => {
            const contest = row.original;
            return format(contest.creatadAt, "EEEEEE kk:mm dd MMM", { locale: ru });
        },
	},
    {
        accessorKey: "reward",
        header: "Награда",
    },
    {
        accessorKey: "typeReword",
        header: "Тип награды",
    },
	{
		id: "actions",
		header: "",
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
                            <CreateUpdateTask task={task}/>
                            <DeleteTask id={task.id}/>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
