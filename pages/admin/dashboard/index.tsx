import * as React from 'react';
// next imports //
import type { GetServerSideProps, GetServerSidePropsResult } from "next";
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

// TODO //
// Alex to add protected pages here //
// soon .. //
export const getServerSideProps: GetServerSideProps =  async (): Promise<GetServerSidePropsResult<any>> => {
  const auth: boolean = true;
  if (auth) {
    return {
      props: { }
    };
  } else {
    return {
      redirect: {
        destination: "/admin",
        permanent: false
      },
      props: {
        errorMessages: [ "Not Logged in "] 
      }
    };
  }
};


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
