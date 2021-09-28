import * as React from 'react';
import { Grid } from "semantic-ui-react";
// additional components //
import { AdminLayout } from '@/components/admin/AdminLayout';
// next imports //
// redux imports //
import { useDispatch } from "react-redux";
import { ProjectActions } from "@/redux/actions/projectActions";
// types //
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult} from "next";
import type { Dispatch } from "redux";
import type { ProjectAction } from "@/redux/_types/projects/actionTypes";
// styles //
import styles from "@/styles/projects/AdminProjectsMainPage.module.css";
// helpers //
import { verifyAdminToken } from "@/components/_helpers/adminComponentHelpers";

interface IAdminProjectsMainPageProps {

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

const AdminProjectsMainPage: React.FunctionComponent<IAdminProjectsMainPageProps> = (props): JSX.Element => {
  // local state and hooks //
  // next hooks //
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<ProjectAction>>();

  // lifecycle methods //
  React.useEffect(() => {
    // add any async data fetching here //
    (async function handleGetData() {
      try {
        await ProjectActions.handleGetAll({ dispatch });
      } catch (error) {
        ProjectActions.handleError({ dispatch, error });
      }
    })();
   
  }, [ dispatch ]);
  
  return (
    <AdminLayout>
      <Grid divided stackable padded style={{ height: "100vh", border: "10px solid red" }} columns={2}>
        <Grid.Row style={{ height: "50px" }}>
          <Grid.Column width={16} textAlign="center">
            <h3>Projects</h3>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ height: "calc(100vh - 50px)"}}>
          <Grid.Column width={"8"} textAlign="center" style={{ height: "100%" }}>
            <h4>Published</h4>
          </Grid.Column>
          <Grid.Column width={"8"} textAlign="center" style={{ height: "100%" }}>
            <h4>Unpublished</h4>

          </Grid.Column>
        </Grid.Row>
      </Grid>
    </AdminLayout>
  );  
};

export default AdminProjectsMainPage;
