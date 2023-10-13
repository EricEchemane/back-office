'use client';

import { ColumnDef } from '@tanstack/react-table';
import { getUsers } from './actions';
import { formatDate } from '@/utils/dates';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

type User = Awaited<ReturnType<typeof getUsers>>['users'][number];

export const columns: ColumnDef<User>[] = [
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
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <button
          className='flex items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Username
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const role: number = row.getValue('status');
      switch (role) {
        case 1:
          return 'Active';
        default:
          return 'Pending';
      }
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role;
      return role?.name ?? '-';
    },
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
