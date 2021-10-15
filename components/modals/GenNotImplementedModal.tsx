import * as React from 'react';
import { Button, Header, Icon, Modal } from "semantic-ui-react";

interface IGeneralNotImlementedModalProps {
  modalOpen: boolean;
  dismissNotImpModal(): void;
}

export const GeneralNotImlementedModal: React.FunctionComponent<IGeneralNotImlementedModalProps> = ({ modalOpen, dismissNotImpModal }): JSX.Element => {
  return (
    <Modal open={ modalOpen } style={{ position: "relative" }} onClose={ dismissNotImpModal } closeIcon>
      <Modal.Content style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2>Wait a Second...</h2>
        <Icon size="massive" color="orange" name="exclamation triangle" />
        <div style={{ textAlign: "center", marginTop: "15px" }}>We have not implemented this feature yet...</div>
        <Button style={{ marginTop: "1em" }} color="green" onClick={ dismissNotImpModal }>Ok Then...</Button>
      </Modal.Content>
    </Modal>
  );
};

