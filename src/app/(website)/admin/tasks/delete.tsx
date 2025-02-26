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

export default function DeleteTask({
	id,
}: {
	id: string;
}) {
	const router = useRouter();

	const deleteMutation = api.task.delete.useMutation({
		onSuccess() {
            toast.success("Задание успешно удалено");
			router.refresh();
		},
		onError() {
            toast.error("Задание не удалено");
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
					<AlertDialogTitle>Удалить задание</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					Вы уверены, что хотите задание?
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
