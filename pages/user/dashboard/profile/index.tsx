import * as React from 'react';
import { Button, Grid, Form, Label, Menu, Segment } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from '@/redux/actions/authActions';
// additional components //
import { EditProfileModal } from "@/components/modals/EditProfileModal";
import { ConfirmProfileDeleteModal } from "@/components/modals/ConfirmProfileDeleteModal";
import { GenErrorModal } from "@/components/modals/GenErrorModal";
import { UserPassInput} from "@/components/shared/forms/UserPassInput";
// helpers //
import { UserDashHelpers } from "@/components/_helpers/displayHelpers";
// styles //
import styles from "@/styles/user/UserProfileIndex.module.css";
// type imports //
import type { Dispatch } from "redux";
import type { IGeneralState } from '@/redux/_types/generalTypes';
import type { UserData, UserFormData } from "@/redux/_types/users/dataTypes";
import type { UserAction } from '@/redux/_types/users/actionTypes';
import type { AuthAction } from '@/redux/_types/auth/actionTypes';

// 
type EditPasswordState = {
  componentOpen: boolean;
  password: {
    value: string;
    errorMsg: string | null;
  };
  passwordConfirm:{
    value: string;
    errorMsg: string | null;
  };
}

const setEmptyPasswordState = (): EditPasswordState => {
  return { componentOpen: false, password: { value: "", errorMsg: null }, passwordConfirm: { value: "", errorMsg: "" }};
};
interface IUserProfileIndexProps {
}

const UserProfileIndex: React.FunctionComponent<IUserProfileIndexProps> = (props): JSX.Element => {
  // local component state //
  const [ editModalOpen, setEditModalOpen ] = React.useState<boolean>(false);
  const [ confirmDeleteProfileOpen, setConfirmDeleteProfileOpen ] = React.useState<boolean>(false);
  const [ editPasswordState, setEditPasswordState ] = React.useState<EditPasswordState>({ componentOpen: true, password: { value: "", errorMsg: null }, passwordConfirm: { value: "", errorMsg: null } }); 
  // redux hooks and state //
  const dispatch: Dispatch<AuthAction | UserAction> = useDispatch();
  const { authState } = useSelector((state: IGeneralState) => state);
  const { responseMsg, error, errorMessages } = authState;
  const currentUser: UserData = authState.currentUser as UserData || UserDashHelpers.defaultUserInfo;
  //
  const handleTriggerEditModal = (): void => {
    setEditModalOpen(!editModalOpen);
  };
  // user update functionaliy //
  const handleUserUpdate = async (): Promise<void> => {

  };
  const handleTriggerModelDelete = (): void => {

  };
  // END User update functionality //

  // togglers for password change component //
  const togglePasswordChangeComponent = (): void => {
    setEditPasswordState({ ...setEmptyPasswordState(), componentOpen: !editPasswordState.componentOpen })
  }
  //

  // Password update change listeners //
  const handleOldPassChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    
  };
  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value.length === 0) {
      setEditPasswordState({ ...editPasswordState, password: { value: e.currentTarget.value, errorMsg: "Field cannot be empty" } });
    } else {
      setEditPasswordState({ ...editPasswordState, password: { value: e.currentTarget.value, errorMsg: null } });
    }
  };
  const handleConfirmPassChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value.length === 0) {
      setEditPasswordState({ ...editPasswordState, passwordConfirm: { value: e.currentTarget.value, errorMsg: "Field cannot be empty" } });
    } else {
      setEditPasswordState({ ...editPasswordState, passwordConfirm: { value: e.currentTarget.value, errorMsg: null } });
    }
  };
  // End Password update change listeners //

  // REDUX dispatches //
  // Update User Profile //
  const handleUpdateUserProfile = async (formData: UserFormData) => {
    const { _id: userId } = currentUser;
    const { authToken: JWTToken } = authState;
    try {
      await AuthActions.handleUpdateUserProfile({ dispatch, userId, JWTToken, formData })
    } catch (error) {
      AuthActions.handleAuthError(dispatch, error);
    }
  }
  // Change User Password //
  const handleUpdateUserPassword = async (): Promise<void> => {

  };

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
          {
            editPasswordState.componentOpen &&
            <Form className={ styles.passChangeForm }>
              <UserPassInput 
                changePassword={ true }
                handleOldPassChange={ handleOldPassChange }
                handlePassChange={ handlePassChange }
                handleConfirmPassChange={ handleConfirmPassChange }
                passwordErrMsg={ editPasswordState.password.errorMsg }
                passwordConfErrMsg={ editPasswordState.passwordConfirm.errorMsg }
              />
            </Form>
          }
          <div className={ styles.passChangeControls }>
            {
              editPasswordState.componentOpen 
              ?
              <Button.Group className={ styles.passChangeBtns }>
                <Button 
                  icon="save" 
                  color="green" 
                  content="Change Password" 
                />
                <Button 
                  basic 
                  icon="cancel" 
                  color="orange" 
                  content="Cancel" 
                  onClick={ togglePasswordChangeComponent }
                />
              </Button.Group>
              :
              <Button 
                basic 
                icon="lock"
                color="facebook"
                content="Change Password" 
                onClick={ togglePasswordChangeComponent }
              />
            }
          </div>
        </Segment>
      </Grid.Row>
    </React.Fragment>
  );
};

export default UserProfileIndex;
