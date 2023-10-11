import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { Toaster } from '@/components/ui/toaster';
import { authOptions } from '@/config/auth';
import Sidebar from './_sidebar';
import Topbar from './_topbar';
import { redirect } from 'next/navigation';

export const runtime = 'nodejs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Back Office',
  description:
    'A complete back-office showcase application with full authentication, permission management, data persistence, caching, dashboard, auditing and logging, elastic-search and more.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const permissions = session.user.permissions ?? [];

  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex'>
          <Sidebar permissions={permissions} />
          <main className='w-full ml-[200px] p-3'>
            <Topbar session={session} />
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
