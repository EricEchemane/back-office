'use client';

import { getPermissions } from './actions';
import { DataTable } from '@/components/table/DataTable';

import CreateNewPermissionDialog from './CreateNewPermissionDialog';
import { usePermissionTableColumns } from './columns';

type Props = {
  data: Awaited<ReturnType<typeof getPermissions>>;
  perPage: number;
  currentPage: number;
};

export default function TableWrapper({ currentPage, data, perPage }: Props) {
  const columns = usePermissionTableColumns();

  return (
    <div className='px-2'>
      <DataTable
        pathName='/users/permissions'
        columns={columns}
        data={data.permissions}
        count={data.count}
        perPage={perPage}
        currentPage={currentPage}
        extraRightTools={<CreateNewPermissionDialog />}
      />
    </div>
  );
}
