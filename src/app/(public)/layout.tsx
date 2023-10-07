import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

export const runtime = 'nodejs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Login | BackOffice',
  description: 'Login to your account',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
