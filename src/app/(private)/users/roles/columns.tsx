"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getRoles } from "./actions";
import { formatDate } from "@/utils/dates";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import TableActions from "@/components/table/TableActions";

export type Role = Awaited<ReturnType<typeof getRoles>>["roles"][number];

export function useRolesTableColumns() {
  const router = useRouter();

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) => {
        const date = row.original.createdAt as unknown as string;
        return formatDate(date);
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Modified at",
      cell: ({ row }) => {
        const date = row.original.updatedAt as unknown as string;
        return formatDate(date);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <TableActions
            title="Actions"
            items={[
              {
                key: 1,
                label: "View Permissions",
                onClick() {
                  router.push(`/users/roles/${row.original.name}`);
                },
                icon: <ArrowRight size={16} />,
              },
            ]}
          />
        );
      },
    },
  ];

  return { columns };
}
