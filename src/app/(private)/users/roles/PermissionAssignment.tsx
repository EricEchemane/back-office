'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { ChevronRight, Trash2 } from 'lucide-react';

import { useDeferredValue, useEffect, useState } from 'react';
import { usePermissionAssignment } from './usePermissionAssignment';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Role } from './columns';
import { Permission } from '@prisma/client';
import { assignPermissionsToRole } from './actions';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

function sortedNames(permissions: Permission[]) {
  return permissions.map((p) => p.name).sort();
}

function removeAssignedFromAvailable(
  available: Permission[],
  assigned: Permission[]
) {
  return available.filter((p) => !assigned.find((rp) => rp.id === p.id));
}

interface Props {
  availablePermissions: Permission[];
  role: Role | undefined;
  setRole: (role: Role | undefined) => void;
}

export default function PermissionAssignment({
  role,
  setRole,
  ...props
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const {
    selectedPermissions,
    assignedPermissions,
    availablePermissions,
    clearSelection,
    setSelectedPermission,
    setAssignedPermissions,
    setAvailablePermissions,
    transferToAssignedPermissions,
    removeFromAssignedPermissions,
  } = usePermissionAssignment();

  useEffect(() => {
    if (!role?.permissions) return;

    clearSelection();
    const available = removeAssignedFromAvailable(
      props.availablePermissions,
      role.permissions.concat(assignedPermissions)
    );

    if (!Boolean(deferredSearchQuery)) {
      setAvailablePermissions(available);
      return;
    }

    const query = deferredSearchQuery.toLowerCase();
    const filtered = available.filter((p) =>
      p.name.toLowerCase().includes(query)
    );
    setAvailablePermissions(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deferredSearchQuery,
    setAvailablePermissions,
    props.availablePermissions,
  ]);

  useEffect(initialize, [
    role,
    setAssignedPermissions,
    setAvailablePermissions,
    props.availablePermissions,
  ]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setRole(undefined);
      setSearchQuery('');
    }
  };

  function reset() {
    clearSelection();
    initialize();
  }

  function initialize() {
    if (!role) return;
    const permissions = role.permissions;
    setAssignedPermissions(permissions);
    const available = removeAssignedFromAvailable(
      props.availablePermissions,
      permissions
    );
    setAvailablePermissions(available);
  }

  async function saveChanges() {
    if (!role) return;
    setLoading(true);
    const res = await assignPermissionsToRole(
      role.name,
      assignedPermissions.map((p) => p.id)
    );
    setLoading(false);

    if (res?.error) {
      toast({ title: res.error, variant: 'destructive' });
      return;
    }

    setRole(undefined);
    router.refresh();
    toast({ title: 'Permissions assigned successfully' });
  }

  const noAssignedPermissions = assignedPermissions.length === 0;
  const hasChanges =
    JSON.stringify(sortedNames(role?.permissions ?? [])) !==
    JSON.stringify(sortedNames(assignedPermissions));

  return (
    <Dialog open={!!role} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Assign permissions to{' '}
            <span className="capitalize">{role?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Be mindful. You are editing how users with this role access the
            system
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-[1fr_min-content_1fr] gap-2 my-4">
          <div className="border rounded p-4">
            <Input
              className="my-1"
              value={searchQuery}
              placeholder="Search..."
              label="Search permissions"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ScrollArea className="h-60 mt-2">
              <ul className="pl-1">
                {availablePermissions.length ? (
                  availablePermissions.map((p) => (
                    <li key={p.id} className="flex my-3 gap-2 items-center">
                      <Checkbox
                        id={p.name}
                        checked={selectedPermissions.has(p.id)}
                        onCheckedChange={(e) => {
                          const selected = Boolean(e.valueOf());
                          setSelectedPermission(p.id, selected);
                        }}
                      />
                      <Label htmlFor={p.name}>{p.name}</Label>
                    </li>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center my-12">
                    <div>No permission </div> matches your search
                  </div>
                )}
              </ul>
            </ScrollArea>
            <button
              onClick={clearSelection}
              className="text-muted-foreground text-xs"
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

          <div className="border rounded-md p-4">
            <div className="text-muted-foreground text-xs">
              Assigned permissions
            </div>
            {noAssignedPermissions ? (
              <div className="my-12 text-center text-sm text-muted-foreground">
                <div className="capitalize">{role?.name}</div> has no
                permissions yet
              </div>
            ) : (
              <ScrollArea className="h-60 mt-2">
                <ul>
                  {assignedPermissions.map((p) => (
                    <li
                      key={p.id}
                      className="flex my-3 gap-2 items-center justify-between"
                    >
                      <Label htmlFor={p.name}>{p.name}</Label>
                      <Trash2
                        size={16}
                        onClick={() => removeFromAssignedPermissions(p.id)}
                        className="cursor-pointer p-[2px] transition hover:bg-neutral-200 rounded"
                      />
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={reset}
            variant={'outline'}
            disabled={!hasChanges || loading}
          >
            Reset
          </Button>
          <Button
            loading={loading}
            className="w-[130px]"
            onClick={saveChanges}
            disabled={!hasChanges}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
