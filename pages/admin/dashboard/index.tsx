import * as React from 'react';
// additional components //
import { AdminMenu } from "../../../components/admin/AdminMenu";
import { AdminMain } from '../../../components/admin/AdminMain';

interface IAdminDashProps {
}

const AdminDash: React.FunctionComponent<IAdminDashProps> = (props): JSX.Element => {
  return (
    <React.Fragment>
      <AdminMenu />
      <AdminMain />
    </React.Fragment>
  );
};

export default AdminDash;
