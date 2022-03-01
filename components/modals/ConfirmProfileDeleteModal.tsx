import * as React from 'react';
import { Button, Modal } from "semantic-ui-react";
// next imports //
// styles //
import styles from "@/styles/modals/ConfirmPRofileDeleteModal.module.css";

interface ConfirmDeleteModalProps {
  modalOpen: boolean;
  handleCloseModal(): void;
  handleProfileDelete(): Promise<any>;
}

export const ConfirmDeleteModal: React.FunctionComponent<ConfirmDeleteModalProps> = ({ modalOpen, handleCloseModal, handleProfileDelete }): JSX.Element => {
  return (
    <Modal closeIcon open={ modalOpen } onClose={ handleCloseModal } style={{ position: "relative" }}  size="large" data-test-id={ "confirm-delete-modal" }>
      <Modal.Header className={ styles.modalHeader }>Confirm Delete Profile</Modal.Header>
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
      <Modal.Content className={ styles.modalBtns }>
        <Button.Group>
          <Button basic color="blue" content="Cancel" icon="cancel" onClick={ handleCloseModal } data-test-id={ "confirm-delete-modal-cancel-btn" } />
          <Button.Or />
          <Button color="red" content="Delete" icon="trash" onClick={ handleProfileDelete } data-test-id={ "confirm-delete-modal-delete-btn" }  />
        </Button.Group>
      </Modal.Content>
    </Modal>
  );
};
