'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Permission } from '@prisma/client';
import { usePermissionAssignment } from './usePermissionAssignment';
import { useState } from 'react';

type Props = {
  availablePermissions: Permission[];
  assignedPermissions: Permission[];
};

export default function PermissionAssignment(props: Props) {
  const {
    assignedPermissions,
    availablePermissions,
    assignPermissions,
    removeFromAssignedPermissions,
  } = usePermissionAssignment(props);

  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(
    new Set()
  );

  const setSelectedPermission = (id: number, selected: boolean) => {
    const clone = new Set(selectedPermissions);
    if (selected) clone.add(id);
    else clone.delete(id);
    setSelectedPermissions(clone);
  };

  return (
    <>
      <div className='grid grid-cols-[1fr_min-content_1fr] gap-2 mt-4'>
        <div className='rounded border p-4'>
          <div className='font-medium mb-4 text-muted-foreground'>
            All permissions
          </div>
          <ul className='space-y-1'>
            {availablePermissions.map((p) => (
              <li key={p.id} className='flex items-center gap-2'>
                <Checkbox
                  id={p.name}
                  onCheckedChange={(e) => {
                    const selected = Boolean(e.valueOf());
                    setSelectedPermission(p.id, selected);
                  }}
                />
                <label htmlFor={p.name}>{p.name}</label>
              </li>
            ))}
          </ul>
        </div>

        <div className='grid place-items-center'>
          <Button
            size={'icon'}
            variant={'secondary'}
            disabled={!selectedPermissions.size}
            onClick={() => {
              assignPermissions(Array.from(selectedPermissions));
            }}
          >
            <ChevronRight />
          </Button>
        </div>

        <div className='rounded border p-4'>
          <div className='font-medium mb-4 text-muted-foreground'>
            Current permissions
          </div>
          <ul className='space-y-1'>
            {assignedPermissions.map((p) => (
              <li
                key={p.id}
                className='flex items-center gap-2 justify-between'
              >
                <div>{p.name}</div>
                <X
                  onClick={() => removeFromAssignedPermissions(p.id)}
                  size={16}
                  className='cursor-pointer transition hover:bg-neutral-200 rounded'
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button className='float-right mt-4'>Save changes</Button>
    </>
  );
}
