import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Test } from "~/lib/shared/types/test";
import { api } from "~/trpc/main/react";

export default function DeleteTest({
  test,
}: {
  test: Test;
}) {
  const utils = api.useUtils();

  const deleteMutation = api.test.delete.useMutation({
    onSuccess: () => {
      toast.success("Тест удален");
      utils.test.getAll.invalidate();
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
          <AlertDialogTitle>Удалить тест?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Это действие нельзя будет отменить
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate({ id: test.id })}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
