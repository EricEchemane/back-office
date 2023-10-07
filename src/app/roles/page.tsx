import { EPermissions } from '@/constants/permissions';
import { prisma } from '@/prisma';
import { redirect } from 'next/navigation';

async function getRoles() {
  const user = await prisma.user.findUnique({
    where: {
      username: 'enginex',
      role: {
        permissions: { some: { name: EPermissions.RolesRead } },
      },
    },
  });
  if (!user) redirect('/');

  return prisma.role.findMany({
    include: {
      permissions: true,
    },
  });
}

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <div>
      <h1 className='mb-8'>Roles</h1>
      <table>
        <thead>
          <tr className='text-left'>
            <th>Role</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td className='pr-4'>{role.name}</td>
              <td>
                <ul>
                  {role.permissions.map((permission) => (
                    <li key={permission.id}>{permission.name}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
