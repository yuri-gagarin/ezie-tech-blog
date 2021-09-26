import * as React from 'react';
import { Grid } from "semantic-ui-react";
// additional components //
import { AdminLayout } from '../../../../components/admin/AdminLayout';
// styles //
import style from "../../../../styles/admin/projects/ProjectsMainPage.module.css";

interface IAdminProjectsMainPageProps {

}



const AdminProjectsMainPage: React.FunctionComponent<IAdminProjectsMainPageProps> = (props): JSX.Element => {

  React.useEffect(() => {

  }, []);
  
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
