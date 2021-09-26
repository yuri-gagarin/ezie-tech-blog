import * as React from 'react';
// next imports //
// redux //
import { useSelector, useDispatch } from "react-redux";
import { BlogPostActions } from "../../../redux/actions/blogPostActions";
// additional components //
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { AdminMain } from '../../../components/admin/AdminMain';
// types //
import type { Dispatch } from "redux";
import type { GetServerSideProps, GetServerSidePropsResult, GetServerSidePropsContext } from "next";
import type { IGeneralState, IGeneralAppAction } from '../../../redux/_types/generalTypes';
// helpers //
import { verifyAdminToken } from "../../../components/_helpers/adminComponentHelpers";

interface IAdminDashProps {

}

export const getServerSideProps: GetServerSideProps =  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
  const token = context.req["signedCookies"].JWTToken;
  let validAdmin: boolean;
  try {
    validAdmin = await verifyAdminToken(token);
  } catch (error) {
    console.log(error);
    validAdmin = false;
  }

  if (validAdmin) {
    return {
      props: { }
    };
  } else {
    return {
      redirect: {
        destination: "/401",
        statusCode: 301,
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
      await BlogPostActions.handleFetchBlogPosts(dispatch);
    }
    getAllData();
  }, [ dispatch ]);

  return (
    <AdminLayout>
      <AdminMain generalState={ state } dispatch={ dispatch } />
    </AdminLayout>
  );
};

export default AdminDash;
