"use client";

import LoadingPage from "~/app/loading";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./columns";
import { api } from "~/trpc/main/react";
import CreateUpdateContest from "./create-update";

export default function AdminContestsPage() {
  const { data: contests, isLoading } = api.contest.getAll.useQuery();
  if (isLoading || !contests) return <LoadingPage />;

  return (
    <div className="space-y-3 py-2">
      <CreateUpdateContest/>
      <DataTable columns={columns} data={contests} />
    </div>
  );
}
