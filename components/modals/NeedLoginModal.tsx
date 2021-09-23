import * as React from 'react';
import { Button, Modal } from "semantic-ui-react";
// next imports //
import Link from "next/link";
// styles //
import styles from "../../styles/modals/NeedLoginModal.module.css";

interface INeedLoginModalProps {
  modalOpen: boolean;
  handleCloseModal(): void;
}

export const NeedLoginModal: React.FunctionComponent<INeedLoginModalProps> = ({ modalOpen, handleCloseModal }): JSX.Element => {
  return (
    <Modal closeIcon open={ modalOpen } onClose={ handleCloseModal } style={{ position: "relative" }}  size="mini">
      <Modal.Header style={{ textAlign: "center" }}>Login Required</Modal.Header>
      <Modal.Content>
        <p className={ styles.modalContent }>
          Login is required for this action.
        </p>
      </Modal.Content>
      <Modal.Content>
        <Link href={"/login"} passHref={ true }>
          <Button fluid color="green" content="Login" />
        </Link>
        <div className={ styles.registerLink }>
          <span>or</span>
          <Link href="/register"><a>Register</a></Link>
        </div>
      </Modal.Content>
    </Modal>
  );
};
