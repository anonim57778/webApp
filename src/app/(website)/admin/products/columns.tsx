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
import type { Product } from "~/lib/shared/types/product";
import CreateUpdateProduct from "./create-update";
import DeleteProduct from "./delete";


export const columns: ColumnDef<Product>[] = [
	{
		accessorKey: "tickets",
		header: "Стоимость",
	},
    {
        accessorKey: "gigaCoins",
        header: "Кол. GIGACOIN",
        cell: ({ row }) => {
            const product = row.original;

            return (
                <h1>{product.gigaCoins} GIGACOIN</h1>
            )
        }
    },
	{
		id: "actions",
		header: "",
		cell({ row }) {
			const product = row.original;

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
                            <CreateUpdateProduct product={product}/>
                            <DeleteProduct id={product.id}/>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
