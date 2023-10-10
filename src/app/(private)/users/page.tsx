import SearchComponent from './SearchComponent';
import { Suspense } from 'react';
import Table from './_table';
import { Skeleton } from '@/components/ui/skeleton';

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

function Loading() {
  return (
    <div className='px-2 py-3 space-y-4'>
      <Skeleton className='h-[2.5rem] w-full' />
      <Skeleton className='h-[2.5rem] w-full' />
      <Skeleton className='h-[2.5rem] w-full' />
      <Skeleton className='h-[2.5rem] w-full' />
      <Skeleton className='h-[2.5rem] w-full' />
    </div>
  );
}

export default async function UsersPage({ searchParams }: PageProps) {
  const suspeseKey = new URLSearchParams(searchParams).toString();

  return (
    <div>
      <SearchComponent />
      <Suspense fallback={<Loading />} key={suspeseKey}>
        <Table searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
