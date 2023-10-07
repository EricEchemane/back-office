import { EPermissions } from '@/constants/permissions';
import Link from 'next/link';
import LogoutButton from './Logout';

export default function Sidebar(props: { permissions: string[] }) {
  const permissions = new Set(props.permissions);

  return (
    <aside className='p-4 border-r h-screen flex flex-col'>
      <h2 className='mb-7'>Backoffice</h2>
      <ul className='space-y-2 grid'>
        {permissions.has(EPermissions.BankRead) && (
          <Link href={'/read'}> Bank Read </Link>
        )}
        {permissions.has(EPermissions.BankCreate) && (
          <Link href={'/create'}> Bank Create </Link>
        )}
        {permissions.has(EPermissions.BankEdit) && (
          <Link href={'/edit'}> Bank Edit </Link>
        )}
        {permissions.has(EPermissions.RolesRead) && (
          <Link href={'/roles'}> Roles </Link>
        )}
      </ul>
      <LogoutButton />
    </aside>
  );
}
