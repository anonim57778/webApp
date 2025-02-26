"use client";

import LoadingPage from "~/app/loading";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./columns";
import { api } from "~/trpc/main/react";
import CreateUpdateTask from "./create-update";

export default function AdminTasksPage() {
  const { data: tasks, isLoading } = api.task.getAllTasksAdmin.useQuery({});
  if (isLoading || !tasks) return <LoadingPage />;

  return (
    <div className="space-y-3 py-2">
      <CreateUpdateTask/>
      <DataTable columns={columns} data={tasks} />
    </div>
  );
}
