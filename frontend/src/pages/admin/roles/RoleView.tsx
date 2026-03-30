import { faCog, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import getRole from '@/api/admin/roles/getRole.ts';
import AdminContentContainer from '@/elements/containers/AdminContentContainer.tsx';
import Spinner from '@/elements/Spinner.tsx';
import SubNavigation from '@/elements/SubNavigation.tsx';
import RoleCreateOrUpdate from '@/pages/admin/roles/RoleCreateOrUpdate.tsx';
import AdminRoleUsers from '@/pages/admin/roles/users/AdminRoleUsers.tsx';

export default function RoleView() {
  const params = useParams<'id'>();

  const { data: role, isLoading } = useQuery({
    queryKey: ['admin', 'roles', { uuid: params.id }],
    queryFn: () => getRole(params.id!),
  });

  return isLoading || !role ? (
    <Spinner.Centered />
  ) : (
    <AdminContentContainer title={role.name}>
      <SubNavigation
        baseUrl={`/admin/roles/${params.id}`}
        items={[
          {
            name: 'General',
            icon: faCog,
            path: `/`,
            element: <RoleCreateOrUpdate contextRole={role} />,
          },
          {
            name: 'Users',
            icon: faUsers,
            path: `/users`,
            element: <AdminRoleUsers role={role} />,
            permission: 'users.read',
          },
        ]}
      />
    </AdminContentContainer>
  );
}
