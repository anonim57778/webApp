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
import { toast } from "sonner";
import { api } from "~/trpc/main/react";
import { X } from "lucide-react";

export default function DeleteFriend({
	id,
}: {
	id: string;
}) {
	const router = useRouter();
    const utils = api.useUtils();

	const deleteMutation = api.user.dleteFriend.useMutation({
		onSuccess() {
            toast.success("Друг успешно удален");
			router.refresh();
            utils.user.getFriends.invalidate();
		},
		onError() {
            toast.error("Друг не удален");
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
                <X className="size-6"/>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Удалить друга</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					Вы уверены, что хотите друга?
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
