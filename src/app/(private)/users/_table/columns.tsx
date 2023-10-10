'use client';

import { ColumnDef } from '@tanstack/react-table';
import { getUsers } from '../actions';
import { Role } from '@prisma/client';

type User = Awaited<ReturnType<typeof getUsers>>['users'][number];

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: 'Username',
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
      const role: Role | null = row.getValue('role');
      return role?.name ?? '-';
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    cell: ({ row }) => {
      const date = row.getValue('createdAt');
      return new Date(date as string).toLocaleDateString('en-ph', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Modified at',
    cell: ({ row }) => {
      const date = row.getValue('updatedAt');
      return new Date(date as string).toLocaleDateString('en-ph', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    },
  },
];
