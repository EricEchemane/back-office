import { Suspense } from 'react';
import TableLoading from '@/components/shared/TableLoading';
import SearchComponent from '@/components/shared/TableSearch';
import UserTable from './table';
import { userSearchConfig } from './config';

export const dynamic = 'force-dynamic';

export interface PageProps {
  searchParams: {
    page?: string;
    per_page?: string;
    username?: string;
    email?: string;
    status?: string;
  };
}

export default async function UsersPage({ searchParams }: PageProps) {
  const suspenseKey = new URLSearchParams(searchParams).toString();

  return (
    <div>
      <SearchComponent pathname='/users' searchConfig={userSearchConfig} />
      <Suspense fallback={<TableLoading />} key={suspenseKey}>
        <UserTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
