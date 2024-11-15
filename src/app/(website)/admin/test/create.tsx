import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
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
  SheetFooter,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import { OnError } from "~/lib/client/on_error";
import { TestSchema } from "~/lib/shared/types/test";
import { api } from "~/trpc/main/react";

export default function CreateTest() {
  // Используем состояние для открытия и закрытия окна
  const [open, setOpen] = useState(false);

  // Используем форму для отправки данных
  const form = useForm({
    resolver: zodResolver(TestSchema),
    defaultValues: {} as z.infer<typeof TestSchema>,
  });

  const utils = api.useUtils();

  const createTestMutation = api.test.create.useMutation({
    onSuccess: () => {
      // Выводим сообщение об успешном создании
      toast.success("Тест создан");
      // Закрываем окно
      setOpen(false);
      // Сбрасываем форму
      form.reset();
      // Обновляем данные в таблице
      // invalidate заного берет с сервера данные и обновит таблицу
      utils.test.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Ошибка", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof TestSchema>) => {
    createTestMutation.mutate(data);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Plus />
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, OnError)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Название" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Название" />
                  </FormControl>
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button>Создать</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
