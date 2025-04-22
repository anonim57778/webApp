"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { toast } from "sonner";
import { api } from "~/trpc/main/react";
import { ProductSchema, type Product } from "~/lib/shared/types/product";

export default function CreateUpdateProduct({
	product,
}: {
	product?: Product;
}) {
	const [open, setOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(ProductSchema),
		defaultValues: product as unknown as z.infer<typeof ProductSchema>,
	});

	const router = useRouter();

	const createMutation = api.product.create.useMutation({
		onSuccess() {
            toast.success("Товар успешно создан");
			form.reset();
			setOpen(false);
			router.refresh();
		},
		onError(error) {
			console.log(error.message);
            toast.error("Товар не создан");
		},
	});

	const updateMutation = api.product.update.useMutation({
		onSuccess() {
            toast.success("Товар успешно обновлен");
			setOpen(false);
			router.refresh();
		},
		onError() {
            toast.error("Товар не обновлен");
		},
	});

	const onSubmit = (data: z.infer<typeof ProductSchema>) => {
		if (product) {
			updateMutation.mutate({ ...data, id: product.id });
			return;
		}
		createMutation.mutate(data);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				{product ? (
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						Редактировать
					</DropdownMenuItem>
				) : (
					<Button className="w-full">Создать</Button>
				)}
			</SheetTrigger>
			<SheetContent className="space-y-4 overflow-y-auto">
				<SheetHeader>
					<SheetTitle className="text-center">Товар</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="tickets"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Стоимость</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Стоимость" />
									</FormControl>
								</FormItem>
							)}
						/>

                        <FormField
							control={form.control}
							name="gigaCoins"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>GIGACOINS</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Кол. GIGACOINS" />
									</FormControl>
								</FormItem>
							)}
						/>

						<Button variant="secondary" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
							Сохранить
						</Button>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
