import * as React from 'react';
import { Form, Button, Input, Label, Modal, Reveal, InputOnChangeData } from "semantic-ui-react";
// next imports //
// styles //
import styles from "@/styles/modals/EditProfileModal.module.css";
// type imports //
import { UserData } from '@/redux/_types/users/dataTypes';

interface EditProfileModalProps {
  modalOpen: boolean;
  handleCloseModal(): void;
  handleModelUpdate(): Promise<any>;
  handleTriggerModelDelete(): void;
  userData: UserData;
}

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
  editingEmail: boolean;
};

export const EditProfileModal: React.FunctionComponent<EditProfileModalProps> = ({ modalOpen, handleCloseModal, handleTriggerModelDelete, handleModelUpdate }): JSX.Element => {
  // local state //
  const [ formFirstNameState, setFormFirstNameState ] = React.useState<FormFirstNameState>({ firstName: "First", editingFirstName: true, firstNameError: null });
  const [ formLastNameState, setFormLastNameState ] = React.useState<FormLastNameState>({ lastName: "Last", editingLastName: true, lastNameError: null });
  const [ formEmailState, setFormEmailState ] = React.useState<FormEmailState>({ email: "user@email.com", editingEmail: true, emailError: null });

  const listenForFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget;
    if (!value) {
      setFormFirstNameState({ ...formFirstNameState, firstName: value, firstNameError: "First name can't be blank" })
    } else {
      setFormFirstNameState({ ...formFirstNameState, firstName: value, firstNameError: null });
    }
  };
  const listenForLastNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget;
    if (!value) {
      setFormLastNameState({ ...formLastNameState, lastName: value, lastNameError: "Last name can't be blank" });
    } else {
      setFormLastNameState({ ...formLastNameState, lastName: value, lastNameError: null });
    }
  };
  const listenForEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.currentTarget;
    if (!value) {
      setFormEmailState({ ...formEmailState, email: value, emailError: "Email can't be blank" });
    } else {
      setFormEmailState({ ...formEmailState, email: value, emailError: null });
    }
  };

  return (
    <Modal className={ styles.editProfileModal } closeIcon open={ modalOpen } onClose={ handleCloseModal } style={{ position: "relative" }}  size="large" data-test-id={ "edit-profile-modal" }>
      <Modal.Content className={ styles.modalBtns }>
        <Button.Group className={ styles.editProfileCancel }>
          <Button basic color="blue" content="Cancel" icon="cancel" onClick={ handleCloseModal } data-test-id={ "edit-profile-modal-cancel-btn" } />
        </Button.Group>
        <Button.Group className={ styles.editProfileControls }>
          <Button baisc color="green" content="Update" icon="save outling" onClick={ handleModelUpdate } />
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
                className={ styles.formInput }
                error={ formFirstNameState.firstNameError ? { content: formFirstNameState.firstNameError, pointing: "below" } : false }
                value={ formFirstNameState.firstName } 
                onChange={ listenForFirstNameChange }
              />
              :
              <div className={ styles.dataContent}>
                <div className={ styles.dataSpan }>{ formFirstNameState.firstName }</div>
                <Button className={ styles.dataEditBtn } basic color="purple" content="Edit" />                
              </div>
            }
          </Form.Field>
          <Form.Field inline={ !formLastNameState.editingLastName }>
            <Label className={ styles.dataLabel } color="teal">Last Name:</Label>
            {
              formLastNameState.editingLastName
              ?
              <Form.Input 
                className={ styles.formInput }
                error={ formLastNameState.lastNameError ? { content: formLastNameState.lastNameError, pointing: "below" } : false }
                value={ formLastNameState.lastName } 
                onChange={ listenForLastNameChange }
              />
              :
              <div className={ styles.dataContent}>
                <div className={ styles.dataSpan }>{ formLastNameState.lastName }</div>
                <Button className={ styles.dataEditBtn } basic color="purple" content="Edit" />
              </div>
            }
          </Form.Field>
          <Form.Field inline={ !formEmailState.editingEmail }>
            <Label className={ styles.dataLabel } color="teal">Email:</Label>
            {
              formEmailState.editingEmail
              ?
              <Form.Input 
                className={ styles.formInput }
                error={{ content: "Unavailable", pointing: "below" }}
                value={ formEmailState.email } 
                onChange={ listenForEmailChange }
              />
              :
              <div className={ styles.dataContent}>
                <div className={ styles.dataSpan }>{ formEmailState.email }</div>
                <Button className={ styles.dataEditBtn } basic color="purple" content="Edit" />
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
