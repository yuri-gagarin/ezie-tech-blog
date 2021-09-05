import * as React from 'react';
// additional components //
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { AdminMain } from '../../../components/admin/AdminMain';

interface IAdminDashProps {
}

const AdminDash: React.FunctionComponent<IAdminDashProps> = (props): JSX.Element => {
  return (
    <AdminLayout>
      <AdminMain />
    </AdminLayout>
  );
};

export default AdminDash;
