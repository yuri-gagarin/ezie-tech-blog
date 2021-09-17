import * as React from 'react';
// redux //
import { useSelector, useDispatch } from "react-redux";
// additional components //
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { AdminMain } from '../../../components/admin/AdminMain';
// types //
import type { IGeneralState } from '../../../redux/_types/generalTypes';

interface IAdminDashProps {

}

const AdminDash: React.FunctionComponent<IAdminDashProps> = (props): JSX.Element => {
  const state = useSelector((state: IGeneralState) => state);
  const dispatch = useDispatch();

  return (
    <AdminLayout>
      <AdminMain generalState={ state } dispatch={ dispatch } />
    </AdminLayout>
  );
};

export default AdminDash;
