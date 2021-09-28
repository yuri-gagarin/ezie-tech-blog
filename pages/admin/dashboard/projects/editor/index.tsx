import * as React from 'react';
import { Grid, GridRow } from "semantic-ui-react";
// redux imports //
import { useSelector } from "react-redux";
// additional components //
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminProjectsMenu } from "@/components/admin/projects/AdminProjectsMenu";
import { AdminProjectForm } from '@/components/admin/forms/AdminProjectForm';
// types //
import type { Dispatch } from "redux";
import type { IGeneralState } from "@/redux/_types/generalTypes";
// styles //
import styles from "@/styles/admin/projects/AdminProjectEditorPage.module.css";

interface IAdminProjectEditorProps {
}

const AdminProjectEditor: React.FunctionComponent<IAdminProjectEditorProps> = (props): JSX.Element => {
  // local component state and hooks //
  // redux state and hooks //
  const { currentSelectedProject } = useSelector((state: IGeneralState) => state.projectsState);
  return (
    <AdminLayout>
      <Grid className={ styles.mainGrid }>
        <Grid.Row className={ styles.projectEditorMenuRow }>
          <AdminProjectsMenu />
        </Grid.Row>
        <Grid.Row className={ styles.projectEditorFormRow }>
          <AdminProjectForm projectData={ currentSelectedProject } />
        </Grid.Row>
      </Grid>
    </AdminLayout>
   
  );
};

export default AdminProjectEditor;
