"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { getPermissions } from "./actions";
import { formatDate } from "@/utils/dates";

import { ArrowUpDown, Pencil } from "lucide-react";
import UpdatePermissionComponent from "./UpdatePermissionComponent";

import TableActions from "@/components/table/TableActions";

type Permission = Awaited<
  ReturnType<typeof getPermissions>
>["permissions"][number];

export function usePermissionTableColumns() {
  const [inEditMode, setIsInEditModa] = useState<number>();

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => {
        const { name, id } = row.original;
        if (inEditMode !== id) return name;
        return (
          <UpdatePermissionComponent
            name={name}
            id={inEditMode}
            onCancel={() => setIsInEditModa(undefined)}
            onSuccess={() => setIsInEditModa(undefined)}
          />
        );
      },
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
                label: "Update Permissions",
                onClick() {
                  setIsInEditModa(row.original.id);
                },
                icon: <Pencil size={16} />,
              },
            ]}
          />
        );
      },
    },
  ];

  return columns;
}
