import { PageProps } from './page';
import { pareseIntWithDefault } from '@/utils/strings';
import { getUsers } from './actions';
import TableWrapper from './TableWrapper';

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
    role: searchParams.role,
  });

  return <TableWrapper data={data} perPage={per_page} currentPage={page} />;
}
