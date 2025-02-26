"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { rewordEnum, typeTaskEnum } from "~/server/db/schema";
import {type Task, TaskSchema } from "~/lib/shared/types/task";

export default function CreateUpdateTask({
	task,
}: {
	task?: Task;
}) {
	const [open, setOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(TaskSchema),
		defaultValues: task as unknown as z.infer<typeof TaskSchema>,
	});

	const router = useRouter();

	const createMutation = api.task.create.useMutation({
		onSuccess() {
            toast.success("Задание успешно создано");
			form.reset();
			setOpen(false);
			router.refresh();
		},
		onError(error) {
			console.log(error.message);
            toast.error("Задание не создано");
		},
	});

	const updateMutation = api.task.update.useMutation({
		onSuccess() {
            toast.success("Задание успешно обновлено");
			setOpen(false);
			router.refresh();
		},
		onError() {
            toast.error("Задание не обновлено");
		},
	});

	const onSubmit = (data: z.infer<typeof TaskSchema>) => {
		if (task) {
			updateMutation.mutate({ ...data, id: task.id });
			return;
		}
		createMutation.mutate(data);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				{task ? (
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						Редактировать
					</DropdownMenuItem>
				) : (
					<Button>Создать</Button>
				)}
			</SheetTrigger>
			<SheetContent className="space-y-4 overflow-y-auto">
				<SheetHeader>
					<SheetTitle className="text-center">Задание</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Название</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Название" />
									</FormControl>
								</FormItem>
							)}
						/>

                        <FormField
							control={form.control}
							name="taskType"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Тип задания</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="bg-input text-muted-foreground">
											<SelectValue placeholder="Выберите тип" />
										</SelectTrigger>
										<SelectContent>
											{typeTaskEnum.enumValues.map((item, i) => (
												<SelectItem key={i} value={item}>{item}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>

                        <FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Количество</FormLabel>
									<FormControl>
										<Input {...field} placeholder="количество" />
									</FormControl>
								</FormItem>
							)}
						/>


                        <FormField
							control={form.control}
							name="reward"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Награда</FormLabel>
									<FormControl>
										<Input {...field} placeholder="награда" />
									</FormControl>
								</FormItem>
							)}
						/>

                        <FormField
							control={form.control}
							name="typeReword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Тип награды</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="bg-input text-muted-foreground">
											<SelectValue placeholder="Выберите тип" />
										</SelectTrigger>
										<SelectContent>
											{rewordEnum.enumValues.map((item, i) => (
												<SelectItem key={i} value={item}>{item}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>

						{form.watch("taskType") == "SUB" && (
							<FormField
								control={form.control}
								name="chanelId"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>Id канала, на который надо подписаться</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Id канала" />
										</FormControl>
									</FormItem>
								)}
							/>
						)}
						<Button variant="secondary" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
							Сохранить
						</Button>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
