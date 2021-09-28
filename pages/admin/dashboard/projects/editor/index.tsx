import * as React from 'react';
import { Grid, GridRow } from "semantic-ui-react";
// additional components //
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminProjectsMenu } from "@/components/admin/projects/AdminProjectsMenu";
import { AdminProjectForm } from '@/components/admin/forms/AdminProjectForm';
// styles //
import styles from "@/styles/admin/projects/AdminProjectEditorPage.module.css";

interface IAdminProjectEditorProps {
}

const AdminProjectEditor: React.FunctionComponent<IAdminProjectEditorProps> = (props): JSX.Element => {
  return (
    <AdminLayout>
      <Grid className={ styles.mainGrid }>
        <Grid.Row className={ styles.projectEditorMenuRow }>
          <AdminProjectsMenu />
        </Grid.Row>
        <Grid.Row className={ styles.projectEditorFormRow }>
          <AdminProjectForm />
        </Grid.Row>
      </Grid>
    </AdminLayout>
   
  );
};

export default AdminProjectEditor;
