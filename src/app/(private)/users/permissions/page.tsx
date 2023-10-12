import SearchComponent from '@/components/table/TableSearch';
import React, { Suspense } from 'react';
import { permissionsSearchConfig } from './config';
import { PermissionsTable } from './table';
import TableLoading from '@/components/table/TableLoading';

export const dynamic = 'force-dynamic';

export interface PageProps {
  searchParams: {
    page?: string;
    per_page?: string;
    name?: string;
  };
}

export default function PermissionsPage({ searchParams }: PageProps) {
  const suspenseKey = new URLSearchParams(searchParams).toString();
  return (
    <div>
      <SearchComponent
        pathname='/users/permissions'
        searchConfig={permissionsSearchConfig}
      />
      <Suspense fallback={<TableLoading />} key={suspenseKey}>
        <PermissionsTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
