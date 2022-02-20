import * as React from 'react';
import { Form, Button, Input, Label, Modal } from "semantic-ui-react";
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

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  editingFirstName: boolean;
  editingLastName: boolean;
  editingEmail: boolean;
}

export const EditProfileModal: React.FunctionComponent<EditProfileModalProps> = ({ modalOpen, handleCloseModal, handleTriggerModelDelete, handleModelUpdate }): JSX.Element => {
  const [ formState, setFormState ] = React.useState<FormState>({ firstName: "First", lastName: "Last", email: "Email", editingFirstName: false, editingLastName: false, editingEmail: false  });

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
          <Form.Field inline>
            <Label className={ styles.dataLabel } color="teal">First Name:</Label>
            <div className={ styles.dataContent} >
              {
                formState.editingFirstName
                ?
                <input value={ formState.firstName } />
                :
                <div className={ styles.dataSpan }>{ formState.firstName }</div>
              }
              <Button className={ styles.dataEditBtn } basic color="purple" content="Edit" />
            </div>

          </Form.Field>
          <Form.Field inline>
            <Label className={ styles.dataLabel } color="teal">Last Name:</Label>
            <div className={ styles.dataContent}>
              {
                formState.editingLastName
                ?
                <input value={ formState.lastName} />
                :
                <div className={ styles.dataSpan }>{ formState.lastName }</div>
              }
              <Button className={ styles.dataEditBtn } basic color="purple" content="Edit" />
            </div>
          </Form.Field>
          <Form.Field inline>
            <Label className={ styles.dataLabel } color="teal">Email:</Label>
            <div className={ styles.dataContent}>
              {
                formState.editingEmail
                ?
                <input value={ formState.email } />
                :
                <div className={ styles.dataSpan }>{ formState.email }</div>
              }
              <Button className={ styles.dataEditBtn } basic color="purple" content="Edit" />
            </div>
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
