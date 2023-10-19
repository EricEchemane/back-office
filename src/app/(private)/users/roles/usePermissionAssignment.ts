import { Permission } from '@prisma/client';
import { useState, useSyncExternalStore } from 'react';

let state: {
  availablePermissions: Map<number, Permission>;
  assignedPermissions: Map<number, Permission>;
} = {
  availablePermissions: new Map(),
  assignedPermissions: new Map(),
};

const subsribers = new Set<() => void>();
const notify = () => subsribers.forEach((fn) => fn());
const subscribe = (fn: () => void) => {
  subsribers.add(fn);
  return () => subsribers.delete(fn);
};
const copyState = () => ({ ...state });

// =================== State Methods ===========================

function setAvailablePermissions(permissions: Permission[]) {
  const newState = copyState();
  newState.availablePermissions = new Map(
    permissions.map((permission) => [permission.id, permission])
  );
  state = newState;
  notify();
}

function setAssignedPermissions(permissions: Permission[]) {
  const newState = copyState();
  newState.assignedPermissions = new Map(
    permissions.map((permission) => [permission.id, permission])
  );
  state = newState;
  notify();
}

function assignPermissions(ids: number[]) {
  const newState = copyState();
  ids.forEach((id) => {
    const p = newState.availablePermissions.get(id);
    if (!p) return;
    newState.availablePermissions.delete(id);
    newState.assignedPermissions.set(id, p);
  });
  state = newState;
  notify();
}

function removeFromAssignedPermissions(id: number) {
  const newState = copyState();
  const p = newState.assignedPermissions.get(id);
  if (!p) return;
  newState.assignedPermissions.delete(id);
  newState.availablePermissions.set(id, p);
  state = newState;
  notify();
}

// =================== Hooks ===========================

export function usePermissionAssignment() {
  const reactiveState = useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );

  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(
    new Set()
  );

  function setSelectedPermission(id: number, selected: boolean) {
    const clone = new Set(selectedPermissions);
    if (selected) clone.add(id);
    else clone.delete(id);
    setSelectedPermissions(clone);
  }

  function transferToAssignedPermissions() {
    assignPermissions(Array.from(selectedPermissions));
    clearSelection();
  }

  function clearSelection() {
    setSelectedPermissions(new Set());
  }

  const availablePermissions = Array.from(
    reactiveState.availablePermissions.values()
  );
  const assignedPermissions = Array.from(
    reactiveState.assignedPermissions.values()
  );

  return {
    assignedPermissions,
    selectedPermissions,
    availablePermissions,
    clearSelection,
    assignPermissions,
    setSelectedPermission,
    setAssignedPermissions,
    setAvailablePermissions,
    removeFromAssignedPermissions,
    transferToAssignedPermissions,
  };
}
