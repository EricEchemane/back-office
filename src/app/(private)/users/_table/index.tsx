import React from 'react';
import { PageProps } from '../page';
import { pareseIntWithDefault } from '@/utils/numbers';
import { getUsers } from '../actions';
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function Table({ searchParams }: PageProps) {
  const page = pareseIntWithDefault(searchParams.page, 1)!;
  const per_page = pareseIntWithDefault(searchParams.per_page, 10)!;

  const data = await getUsers({
    page,
    per_page,
    email: searchParams.email,
    username: searchParams.username,
    status: pareseIntWithDefault(searchParams.status),
  });

  return (
    <div className='px-2'>
      <DataTable columns={columns} data={data.users} count={data.count} />
    </div>
  );
}
