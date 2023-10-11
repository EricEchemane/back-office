import SearchComponent from '@/components/table/TableSearch';
import React, { Suspense } from 'react';
import { rolesSearchConfig } from './config';
import TableLoading from '@/components/table/TableLoading';
import { RolesTable } from './table';

export interface PageProps {
  searchParams: {
    page?: string;
    per_page?: string;
    name?: string;
  };
}

export default function RolesPage({ searchParams }: PageProps) {
  const suspenseKey = new URLSearchParams(searchParams).toString();
  return (
    <div>
      <SearchComponent
        pathname='/users/roles'
        searchConfig={rolesSearchConfig}
      />
      <Suspense fallback={<TableLoading />} key={suspenseKey}>
        <RolesTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
