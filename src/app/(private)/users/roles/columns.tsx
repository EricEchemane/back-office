'use client';

import { ColumnDef } from '@tanstack/react-table';
import { getRoles } from './actions';
import { formatDate } from '@/utils/dates';

type User = Awaited<ReturnType<typeof getRoles>>['roles'][number];

export const columns: ColumnDef<User>[] = [
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
