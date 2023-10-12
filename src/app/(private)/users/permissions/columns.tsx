'use client';

import { ColumnDef } from '@tanstack/react-table';
import { getPermissions } from './actions';
import { formatDate } from '@/utils/dates';

import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import UpdatePermissionComponent from './UpdatePermissionComponent';

type Permission = Awaited<
  ReturnType<typeof getPermissions>
>['permissions'][number];

export function usePermissionTableColumns() {
  const [inEditMode, setIsInEditModa] = useState<number>();

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <button
            className='flex items-center'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className='ml-2 h-4 w-4' />
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
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className='flex items-center gap-2'
                onClick={() => setIsInEditModa(row.original.id)}
              >
                <Pencil size={14} />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
}
