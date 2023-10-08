import { authOptions } from '@/config/auth';
import { getServerSession } from 'next-auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>HomePage</h1>
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </div>
  );
}
