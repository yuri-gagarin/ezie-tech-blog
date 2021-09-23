import * as React from 'react';
import { Button, Modal } from "semantic-ui-react";
// next imports //
import Link from "next/link";
// styles //
import styles from "../../styles/modals/NeedLoginModal.module.css";

interface INeedLoginModalProps {
  modalOpen: boolean;
}

export const NeedLoginModal: React.FunctionComponent<INeedLoginModalProps> = ({ modalOpen }): JSX.Element => {
  return (
    <Modal open={ modalOpen } style={{ position: "relative" }}  size="mini" closeIcon>
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
