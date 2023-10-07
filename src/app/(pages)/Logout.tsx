'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button className='mt-auto' onClick={() => signOut()}>
      Logout
    </button>
  );
}
