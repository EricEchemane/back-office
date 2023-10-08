import '../globals.css';
import { prisma } from '@/prisma';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from './Sidebar';
import { getServerSession } from 'next-auth';
import { Toaster } from '@/components/ui/toaster';

export const runtime = 'nodejs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Back Office',
  description:
    'A complete back-office showcase application with full authentication, permission management, data persistence, caching, dashboard, auditing and logging, elastic-search and more.',
};

async function getPermissions(): Promise<string[]> {
  const session = await getServerSession();
  if (!session?.user?.name) return [];

  const user = await prisma.user.findUnique({
    where: { username: session.user.name },
    include: {
      role: {
        include: {
          permissions: true,
        },
      },
    },
  });
  if (!user?.role) return [];
  return user.role.permissions.map((permission) => permission.name);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const permissions = await getPermissions();

  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex'>
          <Sidebar permissions={permissions} />
          <main className='p-4 h-screen'>
            {children} <Toaster />
          </main>
        </div>
      </body>
    </html>
  );
}
