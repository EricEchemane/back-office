import React from 'react';
import { PageProps } from './page';
import { pareseIntWithDefault } from '@/utils/strings';
import { getRoles } from './actions';
import { columns } from './columns';
import { DataTable } from '@/components/table/DataTable';

export async function RolesTable({ searchParams }: PageProps) {
  const page = pareseIntWithDefault(searchParams.page, 1)!;
  const per_page = pareseIntWithDefault(searchParams.per_page, 10)!;

  const data = await getRoles({
    page,
    per_page,
    name: searchParams.name,
  });

  return (
    <div className='px-2'>
      <DataTable
        pathName='/users/roles'
        columns={columns}
        data={data.roles}
        count={data.count}
        perPage={per_page}
        currentPage={page}
      />
    </div>
  );
}
