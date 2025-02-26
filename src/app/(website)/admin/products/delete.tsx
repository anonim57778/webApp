"use client";

import { useRouter } from "next/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { toast } from "sonner";
import { api } from "~/trpc/main/react";

export default function DeleteProduct({
	id,
}: {
	id: string;
}) {
	const router = useRouter();

	const deleteMutation = api.product.delete.useMutation({
		onSuccess() {
            toast.success("Товар успешно удален");
			router.refresh();
		},
		onError() {
            toast.error("Товар не удален");
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					Удалить
				</DropdownMenuItem>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Удалить товар</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					Вы уверены, что хотите удалить товар?
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogAction onClick={() => deleteMutation.mutate({ id })}>
						Удалить
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
