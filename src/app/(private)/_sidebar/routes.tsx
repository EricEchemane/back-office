import { EPermissions } from '@/constants/permissions';
import { Landmark, User2 } from 'lucide-react';

const routes = [
  {
    displayName: 'Users',
    pathname: '/users',
    permission: EPermissions.UsersRead,
    icon: User2,
    children: [
      {
        displayName: 'Roles',
        pathname: '/users/roles',
        permission: EPermissions.RolesRead,
      },
      {
        displayName: 'Permissions',
        pathname: '/users/permissions',
        permission: EPermissions.PermissionsRead,
      },
    ],
  },
  {
    displayName: 'Bank',
    permission: EPermissions.UsersRead,
    icon: Landmark,
    children: [
      {
        displayName: 'Accounts',
        pathname: '/bank/accounts',
        permission: EPermissions.RolesRead,
      },
      {
        displayName: 'Invoices',
        pathname: '/bank/invoices',
        permission: EPermissions.PermissionsRead,
      },
    ],
  },
];

export const Routes = Object.freeze(routes);
