import * as React from 'react';
import { Button, Grid, Form, Label, Menu, Segment, Message, Loader } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from '@/redux/actions/authActions';
// additional components //
import { EditProfileModal } from "@/components/modals/EditProfileModal";
import { ConfirmProfileDeleteModal } from "@/components/modals/ConfirmProfileDeleteModal";
import { GenErrorModal } from "@/components/modals/GenErrorModal";
import { GeneralLoaderSegment } from "@/components/shared/GeneralLoaderSegment";
import { UserPassInput} from "@/components/shared/forms/UserPassInput";
// helpers //
import { UserDashHelpers } from "@/components/_helpers/displayHelpers";
import { validateUserPasswordChange } from "@/components/_helpers/validators";
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
  loaderOpen: boolean;
  oldPassword: {
    value: string;
    errorMsg: string | null;
  };
  password: {
    value: string;
    errorMsg: string | null;
  };
  passwordConfirm:{
    value: string;
    errorMsg: string | null;
  };
};
type EditPassFormErrorState = {
  visible: boolean;
  errorMessages: string[] | null;
  timeout: NodeJS.Timeout | null;
}

const setEmptyPasswordState = (): EditPasswordState => {
  return { componentOpen: false, loaderOpen: false, oldPassword: { value: "", errorMsg: null }, password: { value: "", errorMsg: null }, passwordConfirm: { value: "", errorMsg: "" }};
};
const setChangePassButtonDisbaled = (editPasswordState: EditPasswordState): boolean => {
  return (editPasswordState.oldPassword.errorMsg || editPasswordState.password.errorMsg || editPasswordState.passwordConfirm.errorMsg) ? true : false;
}
const extractPasswordData = (editPasswordState: EditPasswordState): { oldPassword?: string; newPassword?: string; confirmNewPassword?: string } => {
  const { value: oldPassword } = editPasswordState.oldPassword;
  const { value: newPassword } = editPasswordState.password;
  const { value: confirmNewPassword } = editPasswordState.passwordConfirm;
  return { oldPassword, newPassword, confirmNewPassword };
};

 interface IUserProfileIndexProps {
}

const UserProfileIndex: React.FunctionComponent<IUserProfileIndexProps> = (props): JSX.Element => {
  // local component state //
  const [ editModalOpen, setEditModalOpen ] = React.useState<boolean>(false);
  const [ confirmDeleteProfileOpen, setConfirmDeleteProfileOpen ] = React.useState<boolean>(false);
  const [ editPasswordState, setEditPasswordState ] = React.useState<EditPasswordState>(setEmptyPasswordState()); 
  const [ editPassFormErrorMessages, setEditPassFormErrorMessages ] = React.useState<EditPassFormErrorState>({ visible: false, errorMessages: null, timeout: null });
  const [ APIErrorTimeout, setAPIErrorTimeout ] = React.useState<NodeJS.Timeout | null>(null);
  // redux hooks and state //
  const dispatch: Dispatch<AuthAction | UserAction> = useDispatch();
  const { authState } = useSelector((state: IGeneralState) => state);
  const { responseMsg, error, errorMessages } = authState;
  const currentUser: UserData = authState.currentUser as UserData || UserDashHelpers.defaultUserInfo;
  // aditional modal component triggers //
  const handleTriggerEditModal = (): void => {
    setEditModalOpen(!editModalOpen);
  };
  // togglers for password change component //
  const togglePasswordChangeComponent = (): void => {
    setEditPasswordState({ ...setEmptyPasswordState(), componentOpen: !editPasswordState.componentOpen })
  };
  //

  // Password update change listeners //
  const handleOldPassChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value.length === 0) {
      setEditPasswordState({ ...editPasswordState, oldPassword: { value: e.currentTarget.value, errorMsg: "Enter your current password" } });
    } else {
      setEditPasswordState({ ...editPasswordState, oldPassword: { value: e.currentTarget.value, errorMsg: null } });
    }
  };
  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value.length === 0) {
      setEditPasswordState({ ...editPasswordState, password: { value: e.currentTarget.value, errorMsg: "Enter the new password" } });
    } else {
      setEditPasswordState({ ...editPasswordState, password: { value: e.currentTarget.value, errorMsg: null } });
    }
  };
  const handleConfirmPassChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value.length === 0) {
      setEditPasswordState({ ...editPasswordState, passwordConfirm: { value: e.currentTarget.value, errorMsg: "Confirm the new password" } });
    } else {
      setEditPasswordState({ ...editPasswordState, passwordConfirm: { value: e.currentTarget.value, errorMsg: null } });
    }
  };
  // End Password update change listeners //

  // timeouts to automatically clear errors //
  const editPassFormErrTimeout = (time: number): NodeJS.Timeout => {
    return setTimeout(() => {
      clearTimeout(editPassFormErrorMessages.timeout);
      setEditPassFormErrorMessages({ visible: false, errorMessages: null, timeout: null });
    }, time);
  };
  const authErrorTimeout = (time: number): NodeJS.Timeout => {
    return setTimeout(() => {
      clearTimeout(APIErrorTimeout);
      AuthActions.dismissAuthError(dispatch);
    }, time);
  };
  const dismissFormErrorMessages = (): void => {
    clearTimeout(editPassFormErrorMessages.timeout);
    setEditPassFormErrorMessages({ visible: false, errorMessages: null, timeout: null });
  };
  const dismissGeneralLoaderSegment = (): void => {
    if (authState.error) AuthActions.dismissAuthError(dispatch);
    setEditPasswordState({ ...editPasswordState, loaderOpen: false });
  };
  //

  // REDUX dispatches //
  // Update User Profile //
  const handleUpdateUserProfile = async (formData: UserFormData) => {
    const { _id: userId } = currentUser;
    const { authToken: JWTToken } = authState;
    try {
      console.log("called")
      await AuthActions.handleUpdateUserProfile({ dispatch, userId, JWTToken, formData })
    } catch (error) {
      AuthActions.handleAuthError(dispatch, error);
    }
  }
  // Change User Password //
  const handleUpdateUserPassword = async (): Promise<void> => {
    // clear error form if any //
    if (authState.error) AuthActions.dismissAuthError(dispatch);

    // first ensure that all fields are fillled out //
    const passwordData = extractPasswordData(editPasswordState);
    const { valid, errorMessages } = validateUserPasswordChange(passwordData, { oldPassRequired: true });
    if (!valid) {
      return setEditPassFormErrorMessages({ visible: true, errorMessages, timeout: editPassFormErrTimeout(5000) });
    }
    // assuming all inputs have correct info //
    try {
      await AuthActions.handleUpdateUserPassword({ dispatch, passwordData, authState });
      setEditPasswordState({  ...editPasswordState, componentOpen: false, loaderOpen: true }); // keep loader open so user dismisses manualy //
    } catch (error) {
      AuthActions.handleAuthError(dispatch, error);
    }
  };
  

  const handleDismissErrorModal = (): void => {
    AuthActions.dismissAuthError(dispatch);
  };
  // Profile delete functionality //
  const triggerProfileDelete = (): void => {
    console.log("called trigger delete")
  };
  const cancelProfileDelete = (): void => {

  };
  const handleProfileDelete = async (): Promise<void> => {

  };

  // for now any api error should come up top in <GenErrorModal> component //
  // should be dismissible or auto clear in 5 seconds //
  React.useEffect(() => {
    if (authState.error && !authState.passwordChangeRequest) {
      clearTimeout(APIErrorTimeout);
      setAPIErrorTimeout(authErrorTimeout(5000));
    } else {
      clearTimeout(APIErrorTimeout);
    }
  }, [ authState.error, authState.passwordChangeRequest ]);

  React.useEffect(() => {
    if (authState.passwordChangeRequest) setEditPasswordState((s) => ({ ...s, loaderOpen: true }));
  }, [ authState.passwordChangeRequest ]);

  return (
    <React.Fragment>
      <EditProfileModal
        modalOpen={ editModalOpen }
        handleCloseModal={ handleTriggerEditModal }
        handleUpdateUserProfile={ handleUpdateUserProfile }
        handleTriggerModelDelete={ triggerProfileDelete }
        userData={ currentUser as UserData }

      />
      <ConfirmProfileDeleteModal 
        modalOpen={ confirmDeleteProfileOpen }
        authState={ authState }
        handleCloseModal={ cancelProfileDelete }
        handleProfileDelete={ handleProfileDelete }
      />
      {
      (authState.error && !editPasswordState.componentOpen) && 
      <GenErrorModal 
        open={ authState.error && !editPasswordState.componentOpen }  // should not be open on password change error //
        position="fixed-top"
        animation="fly down"
        duration={ 200 }
        handleErrorModalClose={ handleDismissErrorModal } 
        errorMessages={ authState.errorMessages }
      />
      }
      <Grid.Row className={ styles.controlsRow }>
        <Segment style={{ width: "100%" }}>
          <Button.Group className={ styles.controlBtns }>
            <Button basic content="Go Back" color="green" icon="arrow left" />
          </Button.Group>
          <Button.Group className={ styles.controlBtns }>
            <Button basic content="Edit Profile" color="green" icon="edit" onClick={ () => setEditModalOpen(true) } />
            <Button content="Delete Profile" color="red" icon="trash" />
          </Button.Group>
        </Segment>
      </Grid.Row>
      <Grid.Row className={ styles.contentRow }>
        <Segment className={ styles.userContentSegment }>
          <div className={ styles.userContentInfoDiv }>
            <Label className={ styles.userContentLabel } color="grey">First Name:</Label><span>{ currentUser.firstName || "Did not provide first name yet..." }</span>
          </div>
          <div className={ styles.userContentInfoDiv }>
            <Label className={ styles.userContentLabel } color="grey">Last Name:</Label><span>{ currentUser.lastName || "Did not provide last name yet..." }</span>
          </div>
          <div className={ styles.userContentInfoDiv }>
            <Label className={ styles.userContentLabel } color="grey">Email:</Label><span>{ currentUser.email }</span>
          </div>
          <div className={ styles.userContentInfoDiv }>
            <Label className={ styles.userContentLabel } color="teal">Account Level:</Label><span>{ currentUser.userType }</span>
          </div>
          <div className={ styles.userContentInfoDiv }>
            <Label className={ styles.userContentLabel } color="grey">Registered:</Label><span>{ currentUser.createdAt }</span>
          </div>
        </Segment>
        {
          (authState.passwordChangeRequest || editPasswordState.loaderOpen ) &&
          <Segment className={ styles.passChangeAPIMessageDiv }>
            <div className={ styles.passChangeAPIMessageDivInner }>
              <GeneralLoaderSegment 
                  loading={ authState.loading }
                  completionMessage={ authState.responseMsg }
                  errorMessages={ authState.errorMessages || null }
                  dismissComponent={ dismissGeneralLoaderSegment }
              />
            </div>
          </Segment>
        }
        <Segment className={ styles.passChangeControlsSegment }>
         
          {
          editPasswordState.componentOpen &&
          <Form className={ styles.passChangeForm }>
            
            <Message 
              className={ styles.passChangeErrorMessages }
              visible={ editPassFormErrorMessages.visible }
              floating
              error
              header="Client Error"
              onDismiss={ dismissFormErrorMessages }
              list={ editPassFormErrorMessages.errorMessages }
            />
           
            <UserPassInput 
              changePassword={ true }
              handleOldPassChange={ handleOldPassChange }
              handlePassChange={ handlePassChange }
              handleConfirmPassChange={ handleConfirmPassChange }
              oldPasswordErrMsg={ editPasswordState.oldPassword.errorMsg }
              passwordErrMsg={ editPasswordState.password.errorMsg }
              passwordConfErrMsg={ editPasswordState.passwordConfirm.errorMsg }
            />
          </Form>
          }
          <div className={ styles.passChangeControls }>
            {
              editPasswordState.componentOpen
              ?
              <>
              <Button.Group className={ styles.passChangeBtns }>
                <Button 
                  icon="save" 
                  color="green" 
                  content="Update and Save" 
                  disabled={ setChangePassButtonDisbaled(editPasswordState) }
                  onClick={ handleUpdateUserPassword }
                />
                <Button 
                  basic 
                  icon="cancel" 
                  color="orange" 
                  content="Cancel Changes" 
                  onClick={ togglePasswordChangeComponent }
                />
              </Button.Group>
              </>
              :
              <div className={ styles.passChangeTrigger }>
                <Button 
                  fluid
                  icon="lock"
                  color="facebook"
                  content="Change Password" 
                  onClick={ togglePasswordChangeComponent }
                />
              </div>
            }
          </div>
        </Segment>
      </Grid.Row>
    </React.Fragment>
  );
};

export default UserProfileIndex;
