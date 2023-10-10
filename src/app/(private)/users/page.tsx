import { pareseIntWithDefault } from '@/utils/numbers';
import { getUsers } from './actions';
import SearchComponent from './SearchComponent';

export const dynamic = 'force-dynamic';
interface PageProps {
  searchParams: {
    page?: string;
    per_page?: string;
    username?: string;
    email?: string;
    status?: string;
  };
}

export default async function UsersPage({ searchParams }: PageProps) {
  const page = pareseIntWithDefault(searchParams.page, 1)!;
  const per_page = pareseIntWithDefault(searchParams.per_page, 10)!;

  const users = await getUsers({
    page,
    per_page,
    email: searchParams.email,
    username: searchParams.username,
    status: pareseIntWithDefault(searchParams.status),
  });

  return (
    <div>
      <SearchComponent />
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
