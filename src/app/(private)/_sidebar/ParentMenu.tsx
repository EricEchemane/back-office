'use client';

import { EPermissions } from '@/constants/permissions';
import { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  icon: LucideIcon;
  children: {
    displayName: string;
    pathname: string;
    permission: EPermissions;
  }[];
  pathname?: string;
  displayName: string;
  permission: EPermissions; // permission needed to display this menu
  userPermissions: Set<string>; // permissions of the user

  selected?: string;
  setSelected: (active?: string) => void;
}

export default function ParentMenu(props: Props) {
  const pathname = usePathname();

  // expanded if the current path is one of its children
  const initiallyExpanded =
    (props.pathname && pathname.startsWith(props.pathname)) ||
    props.children?.some((child) => child.pathname === pathname);
  const [expanded, setExpanded] = useState(initiallyExpanded);

  const active = pathname === props.pathname;
  const Chevron = expanded ? ChevronDown : ChevronRight;

  function handleClick() {
    if (!props.pathname || pathname === props.pathname) {
      setExpanded((prev) => !prev);
      return;
    }
    if (!pathname.startsWith(props.pathname)) setExpanded(true);
    props.setSelected(props.displayName);
  }

  let Parent = (
    <Button
      size={'sm'}
      variant={active ? 'secondary' : 'ghost'}
      className='justify-start gap-3 w-full'
      onClick={handleClick}
    >
      <div className='w-[1rem]'>
        <props.icon className='w-[1rem] h-[1rem]' />
      </div>
      {props.displayName}
      <Chevron className='w-[.9rem] h-[.9rem] ml-auto' />
    </Button>
  );

  // Parent menu is a link if it has a pathname
  if (props.pathname) Parent = <Link href={props.pathname}>{Parent}</Link>;

  let children = null;
  if (expanded) {
    children = props.children?.map((child) => {
      const permitted = props.userPermissions.has(child.permission);
      if (!permitted) return null;

      const active = child.pathname === pathname;

      return (
        <div key={child.displayName}>
          <Link href={child.pathname}>
            <Button
              size={'sm'}
              variant={active ? 'secondary' : 'ghost'}
              className='justify-start gap-3 w-full'
              onClick={() => props.setSelected(child.displayName)}
            >
              <div className='w-[1rem]' />
              {child.displayName}
            </Button>
          </Link>
        </div>
      );
    });
  }

  return (
    <div>
      {Parent}
      {children}
    </div>
  );
}
