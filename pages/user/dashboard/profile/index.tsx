import * as React from 'react';
import { Button, Card, Grid, Label, Segment } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from '@/redux/actions/authActions';
// additional components //
import { EditProfileModal } from "@/components/modals/EditProfileModal";
import { ConfirmProfileDeleteModal } from "@/components/modals/ConfirmProfileDeleteModal";
import { GenErrorModal } from "@/components/modals/GenErrorModal";
// helpers //
import { UserDashHelpers } from "@/components/_helpers/displayHelpers";
// styles //
import styles from "@/styles/user/UserProfileIndex.module.css";
// type imports //
import type { Dispatch } from "redux";
import type { IGeneralState } from '@/redux/_types/generalTypes';
import type { UserData, UserFormData } from "@/redux/_types/users/dataTypes";
import type { UserAction } from '@/redux/_types/users/actionTypes';
import { AuthAction } from '@/redux/_types/auth/actionTypes';

interface IUserProfileIndexProps {
}

const UserProfileIndex: React.FunctionComponent<IUserProfileIndexProps> = (props): JSX.Element => {
  // local component state //
  const [ editModalOpen, setEditModalOpen ] = React.useState<boolean>(false);
  const [ confirmDeleteProfileOpen, setConfirmDeleteProfileOpen ] = React.useState<boolean>(false);
  // redux hooks and state //
  const dispatch: Dispatch<AuthAction | UserAction> = useDispatch();
  const { authState } = useSelector((state: IGeneralState) => state);
  const { responseMsg, error, errorMessages } = authState;
  const currentUser: UserData = authState.currentUser as UserData || UserDashHelpers.defaultUserInfo;
  console.log(currentUser)
  //
  const handleTriggerEditModal = (): void => {
    setEditModalOpen(!editModalOpen);
  };
  // user update functionaliy //
  const handleUserUpdate = async (): Promise<void> => {

  };
  const handleTriggerModelDelete = (): void => {

  };

  const handleUpdateUserProfile = async (formData: UserFormData) => {
    const { _id: userId } = currentUser;
    const { authToken: JWTToken } = authState;
    try {
      await AuthActions.handleUpdateUserProfile({ dispatch, userId, JWTToken, formData })
    } catch (error) {
      AuthActions.handleAuthError(dispatch, error);
    }
  }

  const handleDismissErrorModal = (): void => {

  };
  // Profile delete functionality //
  const triggerProfileDelete = (): void => {

  };
  const cancelProfileDelete = (): void => {

  };
  const handleProfileDelete = async (): Promise<void> => {

  };


  return (
    <React.Fragment>
      <EditProfileModal
        modalOpen={ editModalOpen }
        handleCloseModal={ handleTriggerEditModal }
        handleUpdateUserProfile={ handleUpdateUserProfile }
        handleTriggerModelDelete={ handleTriggerModelDelete }
        userData={ currentUser as UserData }

      />
      <ConfirmProfileDeleteModal 
        modalOpen={ confirmDeleteProfileOpen }
        authState={ authState }
        handleCloseModal={ cancelProfileDelete }
        handleProfileDelete={ handleProfileDelete }
      />
      <GenErrorModal 
        open={ authState.error ? true : false } 
        position="fixed-top"
        handleErrorModalClose={ handleDismissErrorModal } 
        errorMessages={ authState.errorMessages }
      />

      <Grid.Row className={ styles.headerRow }> 
        <Segment style={{ heigth: "100%", width: "100%"}} textAlign="center">User Profile Section</Segment>
      </Grid.Row>
      <Grid.Row>
        <Button.Group>
          <Button basic content="Edit Profile" color="green" icon="edit" />
        </Button.Group>
      </Grid.Row>
      <Grid.Row className={ styles.contentRow }>
        <Segment className={ styles.userContentSegment }>
          <div>
            <Label className={ styles.userContentLabel }>First Name:</Label><span>{ currentUser.firstName || "Did not provide first name yet..." }</span>
          </div>
          <div>
            <Label className={ styles.userContentLabel }>Last Name:</Label><span>{ currentUser.lastName || "Did not provide last name yet..." }</span>
          </div>
          <div>
            <Label className={ styles.userContentLabel }>Email:</Label><span>{ currentUser.email }</span>
          </div>
          <div>
            <Label className={ styles.userContentLabel }>Registered:</Label><span>{ currentUser.createdAt }</span>
          </div>
          <Button content="Change Password" />
        </Segment>
      </Grid.Row>
    </React.Fragment>
  );
};

export default UserProfileIndex;
