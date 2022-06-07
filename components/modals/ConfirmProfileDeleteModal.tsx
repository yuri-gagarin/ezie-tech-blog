import * as React from 'react';
import { Button, Form, Label, Message, Modal } from "semantic-ui-react";
// next imports //
// additional components //
import { GeneralLoaderSegment } from '../shared/GeneralLoaderSegment';
// styles //
import styles from "@/styles/modals/ConfirmProfileDeleteModal.module.css";
// type imports //
import type { IAuthState } from '@/redux/_types/auth/dataTypes';

interface ConfirmDeleteModalProps {
  modalOpen: boolean;
  authState: IAuthState;
  handleCloseModal(): void;
  handleProfileDelete(userPassword: string): Promise<any>;
}

type LocalState = {
  confirmDelProfilePass: string;
  errorModalOpen: boolean;
  errorMessage: string | null;
};

export const ConfirmProfileDeleteModal: React.FunctionComponent<ConfirmDeleteModalProps> = ({ modalOpen, authState, handleCloseModal, handleProfileDelete }): JSX.Element => {
  // local component state //
  const [ localState, setLocalState ] = React.useState<LocalState>({ confirmDelProfilePass: "", errorModalOpen: true, errorMessage: null });
  // reddux state //
  const { loading, error, errorMessages } = authState;
  // event listeners //
  const handleConfirmDelProfilePassChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    if (value.length === 0) {
      setLocalState({ ...localState, confirmDelProfilePass: value, errorMessage: "Password cannot be empty" })
    } else {
      setLocalState({ ...localState, confirmDelProfilePass: value, errorModalOpen: false, errorMessage: null });
    }
  };
  // actions //
  const confirmProfileDelete = (): void => {
    // if the password input is empty show an error //
    if (!localState.confirmDelProfilePass) return setLocalState({ ...localState, errorModalOpen: true });
    handleProfileDelete(localState.confirmDelProfilePass);
  };

  return (
    <Modal className={ styles.modal } closeIcon open={ modalOpen } onClose={ handleCloseModal } style={{ position: "relative" }}  size="large" data-test-id={ "confirm-delete-modal" }>
      <Modal.Header className={ styles.modalHeader }>Confirm Delete Profile?</Modal.Header>
      <Modal.Content>
        <p className={ styles.modalContent }>
          Are you sure you want to delete your profile?
        </p>
        <p className={ styles.modalContent }>
          This will delete your profile, log you out as well as archive all your articles and comments
        </p>
        <p>
          This action is pernament and cannot be reversed!
        </p>
      </Modal.Content>
      {
        localState.errorModalOpen &&
        <Modal.Content>
          <Message error onDismiss={ () => setLocalState({ ...localState, errorModalOpen: false }) }>
            <Message.Content>
              <Message.Header>Error</Message.Header>
              <Message.Content>Password cannot be blank!</Message.Content>
            </Message.Content>
          </Message>
        </Modal.Content>
      }
      {
        true || authState.error &&
        <Modal.Content>
          <GeneralLoaderSegment
            loading
            errorMessages={ authState.errorMessages }
          />
        </Modal.Content>
      }
      <Modal.Content>
        <Form className={ styles.confirmDelPassInput }>
          <Form.Field>
            <Label className={ styles.confirmDelPassLabel } color="orange" content="Enter your password to confirm" />
            <Form.Input 
              autoFocus
              type="password"
              onChange={ handleConfirmDelProfilePassChange }
              error={ localState.errorMessage ? { content: localState.errorMessage, pointing: "above" } : false }
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Content className={ styles.modalBtns }>
        <Button.Group className={ styles.controlBtns }>
          <Button basic color="blue" content="Cancel" icon="cancel" onClick={ handleCloseModal } data-test-id={ "confirm-delete-modal-cancel-btn" } />
          <Button.Or />
          <Button color="red" content="Delete" icon="trash" onClick={ confirmProfileDelete } data-test-id={ "confirm-delete-modal-delete-btn" }  />
        </Button.Group>
      </Modal.Content>
    </Modal>
  );
};
