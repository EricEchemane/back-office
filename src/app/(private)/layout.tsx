import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from './Sidebar';
import { getServerSession } from 'next-auth';
import { Toaster } from '@/components/ui/toaster';
import { authOptions } from '@/config/auth';

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
  const permissions = session?.user.permissions ?? [];

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
