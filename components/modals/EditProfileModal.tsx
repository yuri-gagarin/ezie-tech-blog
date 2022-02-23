import * as React from 'react';
import { Form, Button, Input, Label, Modal, Reveal, InputOnChangeData } from "semantic-ui-react";
// next imports //
// styles //
import styles from "@/styles/modals/EditProfileModal.module.css";
// helpers //
import { validateUniqueEmail } from "@/components/_helpers/validators";
// type imports //
import { UserData, UserFormData } from '@/redux/_types/users/dataTypes';

interface EditProfileModalProps {
  modalOpen: boolean;
  handleCloseModal(): void;
  handleUpdateUserProfile(formData: UserFormData): Promise<any>;
  handleTriggerModelDelete(): void;
  userData: UserData;
};

type FormFirstNameState = {
  firstName: string;
  firstNameError: string | null;
  editingFirstName: boolean;
};
type FormLastNameState = {
  lastName: string;
  lastNameError: string | null;
  editingLastName: boolean;
};
type FormEmailState = {
  email: string;
  emailError: string | null;
  active: boolean;
  editingEmail: boolean;
  APItimeout: NodeJS.Timeout | null;
};

export const EditProfileModal: React.FunctionComponent<EditProfileModalProps> = ({ modalOpen, handleCloseModal, handleTriggerModelDelete, handleUpdateUserProfile, userData }): JSX.Element => {
  // userdata from redux state //
  const { _id, firstName, lastName, email, userType } = userData;
  // local state //
  const [ formFirstNameState, setFormFirstNameState ] = React.useState<FormFirstNameState>({ firstName, editingFirstName: false, firstNameError: null });
  const [ formLastNameState, setFormLastNameState ] = React.useState<FormLastNameState>({ lastName, editingLastName: false, lastNameError: null });
  const [ formEmailState, setFormEmailState ] = React.useState<FormEmailState>({ email, editingEmail: false, emailError: null, active: false, APItimeout: null });
  const [ submitBtnDisabled, setSubmitBtnDisable ] = React.useState<boolean>(false);
  

  const setAPICallTimeout = (email: string): NodeJS.Timeout => {
    return setTimeout(async () => {
      console.log("do an email check api call here");
      try {
        const { responseMsg, exists } = await validateUniqueEmail(email);
        if (exists) {
          setFormEmailState({ ...formEmailState, email, emailError: responseMsg });
        }
      } catch (error) {
        console.log(error);
      }
    }, 3000);
  };
  // form value change listeneres //
  // first name related //
  const listenForFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget;
    if (!value) {
      setFormFirstNameState({ ...formFirstNameState, firstName: value, firstNameError: "First name can't be blank" })
    } else {
      setFormFirstNameState({ ...formFirstNameState, firstName: value, firstNameError: null });
    }
  };
  const setFirstNameEdit = (): void => {
    setFormFirstNameState({ ...formFirstNameState, editingFirstName: true });
  }
  const revertFirstNameData = (): void => {
    setFormFirstNameState({ ...formFirstNameState, firstName, editingFirstName: false, firstNameError: null });
  }
  // end first name related //
  // last name related //
  const listenForLastNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget;
    if (!value) {
      setFormLastNameState({ ...formLastNameState, lastName: value, lastNameError: "Last name can't be blank" });
    } else {
      setFormLastNameState({ ...formLastNameState, lastName: value, lastNameError: null });
    }
  };
  const setLastNameEdit = (): void => {
    setFormLastNameState({ ...formLastNameState, editingLastName: true });
  };
  const reverLastNameData = (): void => {
    setFormLastNameState({ ...formLastNameState, lastName, editingLastName: false, lastNameError: null });
  };
  // end last name related //
  // email related //
  const listenForEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget;
    clearTimeout(formEmailState.APItimeout);
    if (!value) {
      setFormEmailState({ ...formEmailState, email: value, emailError: "Email can't be blank", APItimeout: null });
    } else {
      setFormEmailState({ ...formEmailState, email: value, emailError: null, APItimeout: setAPICallTimeout(value) });
    }
  };
  const setEmailEdit = (): void => {
    setFormEmailState({ ...formEmailState, editingEmail: true });
  };  
  const reverEmailData = (): void => {
    setFormEmailState({ ...formEmailState, email, editingEmail: false, emailError: null });
  };
  // end email related //
  // end form value change listeners //

  // update functionality //
  const _handleUpdateUserProfile = async () => {
    const { firstName } = formFirstNameState;
    const { lastName } = formLastNameState;
    const { email } = formEmailState
    return handleUpdateUserProfile({ firstName, lastName, email })
  };
  // lifecycle hooks //
  React.useEffect(() => {
    if (formFirstNameState.firstNameError || formLastNameState.lastNameError || formEmailState.emailError) {
      setSubmitBtnDisable(true);
    } else {
      setSubmitBtnDisable(false);
    }
  }, [ formFirstNameState.firstNameError, formLastNameState.lastNameError, formEmailState.emailError ]);

  return (
    <Modal className={ styles.editProfileModal } closeIcon open={ modalOpen } onClose={ handleCloseModal } style={{ position: "relative" }}  size="large" data-test-id={ "edit-profile-modal" }>
      <Modal.Content className={ styles.modalBtns }>
        <Button.Group className={ styles.editProfileCancel }>
          <Button basic color="blue" content="Cancel" icon="cancel" onClick={ handleCloseModal } data-test-id={ "edit-profile-modal-cancel-btn" } />
        </Button.Group>
        <Button.Group className={ styles.editProfileControls }>
          <Button basic color="green" content="Update" icon="save outling" onClick={ _handleUpdateUserProfile } disabled={ submitBtnDisabled } />
          <Button color="red" content="Delete" icon="trash" onClick={ handleTriggerModelDelete } data-test-id={ "confirm-delete-modal-delete-btn" }  />
        </Button.Group>
      </Modal.Content>
      <Modal.Content>
        <Form>
          <Form.Field inline={ !formFirstNameState.editingFirstName }>
            <Label className={ styles.dataLabel } color="teal">First Name:</Label>
            {
              formFirstNameState.editingFirstName
              ?
              <Form.Input 
                autoFocus
                className={ styles.formInput }
                error={ formFirstNameState.firstNameError ? { content: formFirstNameState.firstNameError, pointing: "below" } : false }
                value={ formFirstNameState.firstName } 
                onChange={ listenForFirstNameChange }
                onBlur={ revertFirstNameData }
              />
              :
              <div className={ styles.dataContent}>
                <div className={ styles.dataSpan }>{ formFirstNameState.firstName }</div>
                <Button className={ styles.dataEditBtn } basic color="purple" content="Edit" onClick={ setFirstNameEdit } />                
              </div>
            }
          </Form.Field>
          <Form.Field inline={ !formLastNameState.editingLastName }>
            <Label className={ styles.dataLabel } color="teal">Last Name:</Label>
            {
              formLastNameState.editingLastName
              ?
              <Form.Input 
                autoFocus
                className={ styles.formInput }
                error={ formLastNameState.lastNameError ? { content: formLastNameState.lastNameError, pointing: "below" } : false }
                value={ formLastNameState.lastName } 
                onChange={ listenForLastNameChange }
                onBlur={ reverLastNameData }
              />
              :
              <div className={ styles.dataContent}>
                <div className={ styles.dataSpan }>{ formLastNameState.lastName }</div>
                <Button className={ styles.dataEditBtn } basic color="purple" content="Edit" onClick={ setLastNameEdit } />
              </div>
            }
          </Form.Field>
          <Form.Field inline={ !formEmailState.editingEmail }>
            <Label className={ styles.dataLabel } color="teal">Email:</Label>
            {
              formEmailState.editingEmail
              ?
              <Form.Input 
                autoFocus
                className={ styles.formInput }
                error={ formEmailState.emailError ? { content: formEmailState.emailError, pointing: "below" }: false }
                value={ formEmailState.email } 
                onChange={ listenForEmailChange }
                onBlur={ reverEmailData }
              />
              :
              <div className={ styles.dataContent}>
                <div className={ styles.dataSpan }>{ formEmailState.email }</div>
                <Button className={ styles.dataEditBtn } basic color="purple" content="Edit" onClick={ setEmailEdit } />
              </div>
            }
          </Form.Field>
          <Form.Field inline>
            <Label className={ styles.dataLabel } color="teal">User Level:</Label>
            <div className={ styles.userLevelContent }>
              <div className={ styles.userLevelDiv }>Contributor</div>
            </div>
          </Form.Field>
        </Form>
      </Modal.Content>
      
    </Modal>
  );
};
