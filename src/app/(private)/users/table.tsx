import React from 'react';
import { PageProps } from './page';
import { pareseIntWithDefault } from '@/utils/strings';
import { getUsers } from './actions';
import { columns } from './columns';
import { DataTable } from '@/components/table/DataTable';

export default async function Table({ searchParams }: PageProps) {
  const page = pareseIntWithDefault(searchParams.page, 1)!;
  const per_page = pareseIntWithDefault(searchParams.per_page, 10)!;

  const data = await getUsers({
    page,
    per_page,
    email: searchParams.email,
    username: searchParams.username,
    status: pareseIntWithDefault(searchParams.status),
    date_from: searchParams.date_from,
    date_to: searchParams.date_to,
  });

  return (
    <div className='px-2'>
      <DataTable
        pathName='/users'
        columns={columns}
        data={data.users}
        count={data.count}
        perPage={per_page}
        currentPage={page}
      />
    </div>
  );
}
