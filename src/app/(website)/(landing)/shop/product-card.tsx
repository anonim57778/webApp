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
import type { Product } from "~/lib/shared/types/product";

export default function ProductCard({
	product,
}: {
	product: Product;
}) {
	const router = useRouter();

	const buyMutation = api.product.buyProduct.useMutation({
		onSuccess() {
            toast.success("Товар куплен");
			router.refresh();
		},
		onError() {
            toast.error("Товар не куплен");
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
                <div className="p-3 bg-secondary text-black rounded-2xl flex flex-col gap-y-1" key={product.id}>
                    <h1 className="text-2xl font-medium">{product.gigaCoins} GIGACOINS</h1>
                    <h1 className="text-lg font-normal text-[#707579]">За {product.tickets} билет</h1>
                </div>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Купить товар</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					Вы уверены, что хотите купить этот товар?
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogAction onClick={() => buyMutation.mutate({ id: product.id })}>
						Купить
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
