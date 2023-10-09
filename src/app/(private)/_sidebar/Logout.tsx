'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <Button variant={'outline'} className='mt-auto' onClick={() => signOut()}>
      Logout
    </Button>
  );
}
