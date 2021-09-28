import * as React from 'react';
import { Grid, GridRow } from "semantic-ui-react";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { ProjectActions } from "@/redux/actions/projectActions";
// additional components //
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminProjectsMenu } from "@/components/admin/projects/AdminProjectsMenu";
import { AdminProjectForm } from '@/components/admin/forms/AdminProjectForm';
// types //
import type { Dispatch } from "redux";
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { ProjectAction } from '@/redux/_types/projects/actionTypes';
import type { ProjectFormData } from '@/redux/_types/projects/dataTypes';
// styles //
import styles from "@/styles/admin/projects/AdminProjectEditorPage.module.css";
// helpers //

interface IAdminProjectEditorProps {

}

const AdminProjectEditor: React.FunctionComponent<IAdminProjectEditorProps> = (props): JSX.Element => {
  // local component state and hooks //
  // redux state and hooks //
  const dispatch = useDispatch<Dispatch<ProjectAction>>();
  const { authState, projectsState } = useSelector((state: IGeneralState) => state);
  // action handlers //
  const handleSaveProjectData = async (formData: ProjectFormData): Promise<any> => {
    const { currentSelectedProject } = projectsState;
    const { loggedIn, authToken: JWTToken, isAdmin } = authState;
    // NOTE //
    // potential API errors already handled within the redux methods //
    if (loggedIn && JWTToken && isAdmin) {
      if (currentSelectedProject && currentSelectedProject._id) {
        const { _id: modelId } = currentSelectedProject;  
        await ProjectActions.handleEdit({ dispatch, modelId, JWTToken, formData, state: projectsState });
      } else {
        await ProjectActions.handleCreate({ dispatch, JWTToken, formData, state: projectsState });
      }
    } else {
      return;
    }
  };
  const handleMenuCancelBtnClick = (): void => {

  };
  const handleMenuPublicBtnClick = async (): Promise<any> => {

  };

  return (
    <AdminLayout>
      <Grid padded className={ styles.mainGrid }>
        <Grid.Row className={ styles.projectEditorFormRow }>
          <AdminProjectForm  
            projectData={ projectsState.currentSelectedProject } 
            handleSaveProjectData={ handleSaveProjectData }
            handleMenuCancelBtnclick={ handleMenuCancelBtnClick }
            handleMenuPublishBtnClick={ handleMenuPublicBtnClick }
          />
        </Grid.Row>
      </Grid>
    </AdminLayout>
   
  );
};

export default AdminProjectEditor;
