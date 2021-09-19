import * as React from 'react';
import { Button, Header, Icon, Modal, Segment } from "semantic-ui-react";

interface IGeneralNotImlementedModalProps {
  modalOpen: boolean;
  dismissNotImpModal(): void;
}

export const GeneralNotImlementedModal: React.FunctionComponent<IGeneralNotImlementedModalProps> = ({ modalOpen, dismissNotImpModal }): JSX.Element => {
  return (
    <Modal open={ modalOpen } size="small" style={{ position: "relative" }}>
      <Segment textAlign="center">
        <Header textAlign="center">Wait a Second...</Header>
        <Icon size="massive" color="orange" name="exclamation triangle" />
        <div style={{ textAlign: "center", marginTop: "15px" }}>We have not implemented this feature yet...</div>
        <Button style={{ marginTop: "5px" }} color="green" onClick={ dismissNotImpModal }>Ok Then...</Button>
      </Segment>
    </Modal>
  );
};

/*
<Modal.Header>Wait a second....</Modal.Header>
<Modal.Content>
  <Modal.Description>We have not implemented this feature yet...</Modal.Description>
</Modal.Content>
<Modal.Actions>
  <Button color="blue" content="Allrighty then..." />
</Modal.Actions>
*/