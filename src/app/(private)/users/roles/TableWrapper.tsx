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
  const { columns } = useRolesTableColumns();

  return (
    <div className='px-2'>
      <DataTable
        pathName='/users/roles'
        columns={columns}
        data={data.roles}
        count={data.count}
        perPage={perPage}
        currentPage={currentPage}
      />
    </div>
  );
}
