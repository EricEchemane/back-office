'use client';

import { Routes } from './routes';
import ParentMenu from './ParentMenu';
import { useState } from 'react';
import LogoutButton from './Logout';

export default function Sidebar(props: { permissions: string[] }) {
  const userPermissions = new Set(props.permissions);
  const [selected, setSelected] = useState<string | undefined>();

  return (
    <nav className='border-r h-screen flex flex-col min-w-[200px] p-3'>
      {Routes.map((route) => {
        const permitted = userPermissions.has(route.permission);
        if (!permitted) return null;

        return (
          <ParentMenu
            {...route}
            selected={selected}
            key={route.displayName}
            userPermissions={userPermissions}
            setSelected={(s) => setSelected(s)}
          />
        );
      })}

      <LogoutButton />
    </nav>
  );
}
