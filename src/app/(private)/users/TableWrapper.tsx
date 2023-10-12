'use client';

import { getUsers } from './actions';
import { columns } from './columns';
import { DataTable } from '@/components/table/DataTable';

interface Props {
  data: Awaited<ReturnType<typeof getUsers>>;
  perPage: number;
  currentPage: number;
}

export default function Wrapper({ data, currentPage, perPage }: Props) {
  function handleSelectRows(selectedIndeces: Record<number, boolean>) {
    Object.keys(selectedIndeces).forEach((index) => {
      const user = data.users[Number(index)];
      user; // do something with user
    });
  }

  return (
    <div className='px-2'>
      <DataTable
        onSelectRows={handleSelectRows}
        pathName='/users'
        columns={columns}
        data={data.users}
        count={data.count}
        perPage={perPage}
        currentPage={currentPage}
      />
    </div>
  );
}
