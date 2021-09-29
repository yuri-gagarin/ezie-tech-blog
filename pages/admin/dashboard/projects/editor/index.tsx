import * as React from 'react';
import { Grid } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { ProjectActions } from "@/redux/actions/projectActions";
// additional components //
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminProjectForm } from '@/components/admin/forms/AdminProjectForm';
// types //
import type { Dispatch } from "redux";
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { ProjectAction } from '@/redux/_types/projects/actionTypes';
import type { ProjectFormData } from '@/redux/_types/projects/dataTypes';
import type FirebaseController from 'firebase/firebaseSetup';
// styles //
import styles from "@/styles/admin/projects/AdminProjectEditorPage.module.css";
// helpers //

interface IAdminProjectEditorProps {
  firebaseContInstance: FirebaseController
}

const AdminProjectEditor: React.FunctionComponent<IAdminProjectEditorProps> = ({ firebaseContInstance }): JSX.Element => {
  // local component state and hooks //
  // next hooks //
  const router = useRouter();
  // redux state and hooks //
  const dispatch = useDispatch<Dispatch<ProjectAction>>();
  const { authState, projectsState } = useSelector((state: IGeneralState) => state);

  // action handlers //
  const handleSaveProjectData = async (formData: ProjectFormData): Promise<any> => {
    const { currentSelectedProject } = projectsState;
    const { loggedIn, authToken: JWTToken, isAdmin } = authState;
    // NOTE //
    if (loggedIn && JWTToken && isAdmin) {
      if (currentSelectedProject && currentSelectedProject._id) {
        const { _id: modelId } = currentSelectedProject;  
        try {
          await ProjectActions.handleEdit({ dispatch, modelId, JWTToken, formData, state: projectsState });
        } catch (error) {
          return ProjectActions.handleError({ dispatch, error });
        }
      } else {
        try {
          await ProjectActions.handleCreate({ dispatch, JWTToken, formData, state: projectsState });
        } catch (error) {
          return ProjectActions.handleError({ dispatch, error });
        }
      }
      router.push("/admin/dashboard/projects");
    }
  };
  const handleMenuCancelBtnClick = (): void => {
    ProjectActions.handleClearCurrentProjData({ dispatch });
    router.push("/admin/dashboard/projects");
  };
  const handleMenuPublicBtnClick = async (): Promise<any> => {

  };
  const handleUploadProjectImage = (file: File) => {
    if (file && firebaseContInstance) {
      firebaseContInstance.uploadPojectImage(file);
    }
  }
  // END action handlers //

  return (
    <AdminLayout>
      <Grid padded className={ styles.mainGrid }>
        <Grid.Row className={ styles.projectEditorFormRow }>
          <AdminProjectForm  
            projectData={ projectsState.currentSelectedProject } 
            handleSaveProjectData={ handleSaveProjectData }
            handleMenuCancelBtnclick={ handleMenuCancelBtnClick }
            handleMenuPublishBtnClick={ handleMenuPublicBtnClick }
            handleUploadProjectImage={ handleUploadProjectImage }
          />
        </Grid.Row>
      </Grid>
    </AdminLayout>
   
  );
};

export default AdminProjectEditor;
