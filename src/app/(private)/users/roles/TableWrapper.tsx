'use client';

import { DataTable } from '@/components/table/DataTable';
import { useRolesTableColumns } from './columns';
import { getRoles } from './actions';

type Props = {
  data: Awaited<ReturnType<typeof getRoles>>;
  perPage: number;
  currentPage: number;
};

export default function TableWrapper({ currentPage, data, perPage }: Props) {
  const { columns, PermissionAssignmentComp } = useRolesTableColumns(
    data.permissions
  );

  return (
    <div className="px-2">
      <DataTable
        columns={columns}
        data={data.roles}
        perPage={perPage}
        count={data.count}
        pathName="/users/roles"
        currentPage={currentPage}
      />
      {PermissionAssignmentComp}
    </div>
  );
}
