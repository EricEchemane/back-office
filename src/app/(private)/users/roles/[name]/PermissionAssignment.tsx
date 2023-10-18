'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Permission } from '@prisma/client';
import { usePermissionAssignment } from './usePermissionAssignment';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assignPermissionsToRole } from './actions';
import { useToast } from '@/components/ui/use-toast';

function sortedNames(permissions: Permission[]) {
  return permissions.map((p) => p.name).sort();
}

type Props = {
  availablePermissions: Permission[];
  assignedPermissions: Permission[];
  roleName: string;
};

export default function PermissionAssignment(props: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    assignedPermissions,
    selectedPermissions,
    availablePermissions,
    clearSelection,
    setSelectedPermission,
    removeFromAssignedPermissions,
    transferToAssignedPermissions,
  } = usePermissionAssignment(props);

  async function saveChanges() {
    setLoading(true);
    await assignPermissionsToRole(
      props.roleName,
      assignedPermissions.map((p) => p.id)
    );
    setLoading(false);
    toast({ title: 'Permissions assigned successfully' });
    router.refresh();
  }

  const hasChanges =
    JSON.stringify(sortedNames(props.assignedPermissions)) !==
    JSON.stringify(sortedNames(assignedPermissions));

  return (
    <>
      <div className="grid grid-cols-[1fr_min-content_1fr] gap-2 mt-4">
        <div className="rounded border p-4">
          <div className="font-medium mb-4 text-muted-foreground">
            All permissions
          </div>
          <ul className="space-y-1">
            {availablePermissions.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <Checkbox
                  id={p.name}
                  checked={selectedPermissions.has(p.id)}
                  onCheckedChange={(e) => {
                    const selected = Boolean(e.valueOf());
                    setSelectedPermission(p.id, selected);
                  }}
                />
                <label htmlFor={p.name}>{p.name}</label>
              </li>
            ))}
          </ul>

          <button
            onClick={clearSelection}
            className="mt-4 float-right text-sm cursor-pointer active:bg-neutral-100 p-1"
          >
            Clear selection
          </button>
        </div>

        <div className="grid place-items-center">
          <Button
            size={'icon'}
            variant={'secondary'}
            disabled={!selectedPermissions.size}
            onClick={transferToAssignedPermissions}
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="rounded border p-4">
          <div className="font-medium mb-4 text-muted-foreground">
            Current permissions
          </div>
          <ul className="space-y-1">
            {assignedPermissions.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-2 justify-between"
              >
                <div>{p.name}</div>
                <X
                  onClick={() => removeFromAssignedPermissions(p.id)}
                  size={16}
                  className="cursor-pointer transition hover:bg-neutral-200 rounded"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 justify-end">
        <Button disabled={!hasChanges} onClick={saveChanges} loading={loading}>
          Save changes
        </Button>
        <Button disabled={loading} variant={'outline'} onClick={router.back}>
          Cancel
        </Button>
      </div>
    </>
  );
}
