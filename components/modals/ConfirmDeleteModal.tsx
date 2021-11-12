import * as React from 'react';
import { Button, Modal } from "semantic-ui-react";
// next imports //
// styles //
import styles from "@/styles/modals/ConfirmDeleteModal.module.css";

interface ConfirmDeleteModalProps {
  modalOpen: boolean;
  handleCloseModal(): void;
  handleModelDelete(): Promise<any>;
}

export const ConfirmDeleteModal: React.FunctionComponent<ConfirmDeleteModalProps> = ({ modalOpen, handleCloseModal, handleModelDelete }): JSX.Element => {
  return (
    <Modal closeIcon open={ modalOpen } onClose={ handleCloseModal } style={{ position: "relative" }}  size="large" data-test-id={ "Confirm_Delete_Modal" }>
      <Modal.Header className={ styles.modalHeader }>Confirm Delete Action</Modal.Header>
      <Modal.Content>
        <p className={ styles.modalContent }>
          Confirm to delete the data. This action is permanent.
        </p>
      </Modal.Content>
      <Modal.Content className={ styles.modalBtns }>
        <Button.Group>
          <Button basic color="blue" content="Cancel" icon="cancel" onClick={ handleCloseModal } data-test-id={ "Confirm_Delete_Modal_Cancel_Btn" } />
          <Button.Or />
          <Button color="red" content="Delete" icon="trash" onClick={ handleModelDelete } data-test-id={ "Confirm_Delete_Modal_Del_Btn" }  />
        </Button.Group>
      </Modal.Content>
    </Modal>
  );
};
