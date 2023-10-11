'use client';

import { useState } from 'react';
import { Routes } from './routes';
import ParentMenu from './ParentMenu';

export default function Sidebar(props: { permissions: string[] }) {
  const userPermissions = new Set(props.permissions);
  const [selected, setSelected] = useState<string | undefined>();

  return (
    <nav className='border-r h-screen flex flex-col min-w-[200px] p-3 fixed left-0 top-0 bottom-0'>
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
    </nav>
  );
}
