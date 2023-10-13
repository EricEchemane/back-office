'use client';

import { ColumnDef } from '@tanstack/react-table';
import { getRoles } from './actions';
import { formatDate } from '@/utils/dates';
import { Checkbox } from '@/components/ui/checkbox';

type Roles = Awaited<ReturnType<typeof getRoles>>['roles'][number];

export const columns: ColumnDef<Roles>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    cell: ({ row }) => {
      const date = row.original.createdAt as unknown as string;
      return formatDate(date);
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Modified at',
    cell: ({ row }) => {
      const date = row.original.updatedAt as unknown as string;
      return formatDate(date);
    },
  },
];
