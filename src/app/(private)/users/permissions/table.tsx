import { PageProps } from './page';
import { pareseIntWithDefault } from '@/utils/strings';
import { getPermissions } from './actions';
import TableWrapper from './TableWrapper';

export async function PermissionsTable({ searchParams }: PageProps) {
  const page = pareseIntWithDefault(searchParams.page, 1)!;
  const per_page = pareseIntWithDefault(searchParams.per_page, 10)!;

  const data = await getPermissions({
    page,
    per_page,
    name: searchParams.name,
  });

  return <TableWrapper data={data} perPage={per_page} currentPage={page} />;
}
