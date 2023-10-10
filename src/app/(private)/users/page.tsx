import SearchComponent from './SearchComponent';
import { Suspense } from 'react';
import Table from './Table';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className='p-2 space-y-4'>
      <Skeleton className='h-[2rem] w-full' />
      <Skeleton className='h-[2rem] w-full' />
      <Skeleton className='h-[2rem] w-full' />
      <Skeleton className='h-[2rem] w-full' />
      <Skeleton className='h-[2rem] w-full' />
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
