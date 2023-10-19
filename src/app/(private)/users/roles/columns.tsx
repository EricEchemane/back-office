'use client';

import { ColumnDef } from '@tanstack/react-table';
import { getRoles } from './actions';
import { formatDate } from '@/utils/dates';
import { KeyRound } from 'lucide-react';

import TableActions from '@/components/table/TableActions';
import { useState } from 'react';
import { Permission } from '@prisma/client';
import PermissionAssignment from './PermissionAssignment';

export type Role = Awaited<ReturnType<typeof getRoles>>['roles'][number];

export function useRolesTableColumns(availablePermissions: Permission[]) {
  const [role, setRole] = useState<Role | undefined>();

  const PermissionAssignmentComp = (
    <PermissionAssignment
      role={role}
      setRole={setRole}
      availablePermissions={availablePermissions}
    />
  );

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.name}</span>
      ),
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
          <TableActions
            title="Actions"
            items={[
              {
                key: 1,
                label: 'View Permissions',
                icon: <KeyRound size={14} />,
                onClick: () => setRole(row.original),
              },
            ]}
          />
        );
      },
    },
  ];

  return { columns, PermissionAssignmentComp };
}
