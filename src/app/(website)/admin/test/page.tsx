"use client";

import LoadingPage from "~/app/loading";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./columns";
import { api } from "~/trpc/main/react";

export default function TestPage() {
  const { data: tests, isLoading } = api.test.getAll.useQuery();
  if (isLoading || !tests) return <LoadingPage />;

  return (
    <div className="">
      <DataTable columns={columns} data={tests} />
    </div>
  );
}
