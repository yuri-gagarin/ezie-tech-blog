import * as React from 'react';
import { Button, Form, Input, Label, Modal } from "semantic-ui-react";
// next imports //
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
};

export const ConfirmProfileDeleteModal: React.FunctionComponent<ConfirmDeleteModalProps> = ({ modalOpen, authState, handleCloseModal, handleProfileDelete }): JSX.Element => {
  // local component state //
  const [ localState, setLocalState ] = React.useState<LocalState>({ confirmDelProfilePass: "" });
  // reddux state //
  const { error, errorMessages } = authState;
  // event listeners //
  const handleConfirmDelProfilePassChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setLocalState({ ...localState, confirmDelProfilePass: value });
  };
  // actions //
  const confirmProfileDelete = (): void => {
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
          This action is pernament and cannot be reversed
        </p>
      </Modal.Content>
      <Modal.Content>
        <Form className={ styles.confirmDelPassInput }>
          <Form.Field>
            <Label className={ styles.confirmDelPassLabel } color="orange" content="Enter your password to confirm" />
            <Form.Input 
              autoFocus
              type="password"
              onChange={ handleConfirmDelProfilePassChange }
              error={{ content: "Error", pointing: "above" }}
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
