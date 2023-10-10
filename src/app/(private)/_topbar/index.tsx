'use client';

import { Session } from 'next-auth';
import BreadCrumb from './BreadCrumb';

import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Props {
  session: Session;
}

export default function Topbar({ session: { user } }: Props) {
  function confirmLogout(): void {
    if (confirm('Are you sure you want to logout?')) signOut();
  }

  return (
    <header className='flex items-center justify-between pr-2'>
      <BreadCrumb />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={'icon'} className='rounded-full'>
            <Avatar>
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className='text-xl text-neutral-900 uppercase'>
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 mr-2'>
          <DropdownMenuLabel>
            <div className='capitalize'>{user.name}</div>
            <div className='text-xs font-normal'>{user.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={confirmLogout}>
              <LogOutIcon className='mr-2 h-4 w-4' />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
