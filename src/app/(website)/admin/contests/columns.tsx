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
import type { Contest } from "~/lib/shared/types/contest";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import CreateUpdateContest from "./create-update";
import DeleteContest from "./delete";


export const columns: ColumnDef<Contest>[] = [
	{
		accessorKey: "name",
		header: "Название",
	},
    {
        accessorKey: "status",
        header: "Статус",
    },
    {
		accessorKey: "startDate",
		header: "Дата начала",
        cell: ({ row }) => {
            const contest = row.original;
            return format(contest.startDate, "EEEEEE kk:mm dd MMM", { locale: ru });
        },
	},
    {
		accessorKey: "endDate",
		header: "Дата окончания",
        cell: ({ row }) => {
            const contest = row.original;
            return format(contest.endDate, "EEEEEE kk:mm dd MMM", { locale: ru });
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
			const contest = row.original;

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
                            <CreateUpdateContest contest={contest} />
                            <DeleteContest id={contest.id} />
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
