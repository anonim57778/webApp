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
	FormDescription,
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
import { ContestSchema, type Contest } from "~/lib/shared/types/contest";
import { api } from "~/trpc/main/react";
import { DatePicker } from "~/components/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { rewordEnum } from "~/server/db/schema";

export default function CreateUpdateContest({
	contest,
}: {
	contest?: Contest;
}) {
	const [open, setOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(ContestSchema),
		defaultValues: contest ? contest : {} as z.infer<typeof ContestSchema>,
	});

	const router = useRouter();

	const createMutation = api.contest.create.useMutation({
		onSuccess() {
            toast.success("Конкурс успешно создан");
			form.reset();
			setOpen(false);
			router.refresh();
		},
		onError(error) {
			console.log(error.message);
            toast.error("Конкурс не создан");
		},
	});

	const updateMutation = api.contest.update.useMutation({
		onSuccess() {
            toast.success("Конкурс успешно обновлен");
			setOpen(false);
			router.refresh();
		},
		onError() {
            toast.error("Конкурс не обновлен");
		},
	});

	const onSubmit = (data: z.infer<typeof ContestSchema>) => {
		if (contest) {
			updateMutation.mutate({ ...data, id: contest.id });
			return;
		}
		createMutation.mutate(data);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				{contest ? (
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						Редактировать
					</DropdownMenuItem>
				) : (
					<Button>Создать</Button>
				)}
			</SheetTrigger>
			<SheetContent className="space-y-4 overflow-y-auto">
				<SheetHeader>
					<SheetTitle className="text-center">Конкурс</SheetTitle>
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
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <DatePicker
                                            date={field.value ?? undefined}
                                            setDate={field.onChange}
                                            mode="single"
                                        />
                                    </FormControl>

                                    <FormDescription className="pb-2">
                                        Дата конца
                                    </FormDescription>
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
						<Button variant="secondary" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
							Сохранить
						</Button>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
