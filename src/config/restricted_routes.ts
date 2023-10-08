import { EPermissions } from '@/constants/permissions';

interface RouteWithPermission {
  path: string;
  permission: EPermissions;
}

export const restrictedRoutes: RouteWithPermission[] = [
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
