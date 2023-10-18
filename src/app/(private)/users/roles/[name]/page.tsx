import { getPermissionsNotInRole, getRoleByName } from './actions';
import PermissionAssignment from './PermissionAssignment';

export const dynamic = 'force-dynamic';

export default async function RoleDetailPage({
  params,
}: {
  params: { name: string };
}) {
  const [role, permissionsInitialOptions] = await Promise.all([
    getRoleByName(decodeURIComponent(params.name)),
    getPermissionsNotInRole(params.name),
  ]);

  if (!role) {
    return <div className="p-2 text-red-600 font-bold">Role not found</div>;
  }

  return (
    <div className="py-4 m-auto w-[750px]">
      <h1 className="text-lg font-bold capitalize"> {role.name} Role </h1>
      <PermissionAssignment
        roleName={role.name}
        assignedPermissions={role.permissions}
        availablePermissions={permissionsInitialOptions}
      />
    </div>
  );
}
