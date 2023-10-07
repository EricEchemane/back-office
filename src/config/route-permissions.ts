import { EPermissions } from '@/constants/permissions';

interface RoutePermission {
  path: string;
  permission: EPermissions;
}

export const routePermissions: RoutePermission[] = [
  {
    path: '/read',
    permission: EPermissions.BankRead,
  },
  {
    path: '/create',
    permission: EPermissions.BankCreate,
  },
  {
    path: '/edit',
    permission: EPermissions.BankEdit,
  },
  {
    path: '/roles',
    permission: EPermissions.RolesRead,
  },
];
