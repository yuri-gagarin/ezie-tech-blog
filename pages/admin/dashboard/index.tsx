import * as React from 'react';
// redux //
import { useSelector, useDispatch } from "react-redux";
import { handleFetchBlogPosts } from "../../../redux/actions/blogPostActions";
// additional components //
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { AdminMain } from '../../../components/admin/AdminMain';
// types //
import type { IGeneralState, IGeneralAppAction } from '../../../redux/_types/generalTypes';
import type { Dispatch } from "redux";

interface IAdminDashProps {

}

const AdminDash: React.FunctionComponent<IAdminDashProps> = (props): JSX.Element => {
  // redux hooks and state //
  const state = useSelector((state: IGeneralState) => state);
  const dispatch = useDispatch<Dispatch<IGeneralAppAction>>();

  React.useEffect(() => {
    async function getAllData() {
      await handleFetchBlogPosts(dispatch);
    }
    getAllData();
  }, []);

  return (
    <AdminLayout>
      <AdminMain generalState={ state } dispatch={ dispatch } />
    </AdminLayout>
  );
};

export default AdminDash;
