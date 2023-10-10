import React from 'react';
import { PageProps } from './page';
import { pareseIntWithDefault } from '@/utils/numbers';
import { getUsers } from './actions';

export const dynamic = 'force-dynamic';

export default async function Table({ searchParams }: PageProps) {
  const page = pareseIntWithDefault(searchParams.page, 1)!;
  const per_page = pareseIntWithDefault(searchParams.per_page, 10)!;

  const users = await getUsers({
    page,
    per_page,
    email: searchParams.email,
    username: searchParams.username,
    status: pareseIntWithDefault(searchParams.status),
  });

  return <pre className='p-2'>{JSON.stringify(users, null, 2)}</pre>;
}
