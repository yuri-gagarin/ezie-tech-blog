import * as React from 'react';
import { Button, Header, Icon, Modal } from "semantic-ui-react";
// types //
import type { ProjectData } from '@/redux/_types/projects/dataTypes';

interface IAdminProjectPreviewProps {
  open: boolean;
  projectData: ProjectData;
  closePreviewModal(): void;
}

export const AdminProjectPreview: React.FunctionComponent<IAdminProjectPreviewProps> = ({ open, projectData, closePreviewModal }): JSX.Element => {
  return (
    projectData ?
      <Modal open={ open } size="fullscreen" style={{ position: "relative" }}> 
        <Button.Group>
          <Button basic color="teal" onClick={ closePreviewModal }>
            <Icon color="teal" name="close" />
            Close
          </Button>
          <Button basic color="orange">
            <Icon color="orange" name="edit" />
            Edit
          </Button>
          <Button basic color="blue">
            <Icon color="blue" name="newspaper" />
            Publish
          </Button>
        </Button.Group>
        <Header>{ projectData.title }</Header>
        <Modal.Content scrolling>
          <Modal.Description>
            <h3>Description:</h3>
            { projectData.description }
          </Modal.Description>
          <Modal.Description>
            <h3>Challenges:</h3>
            { projectData.challenges }
          </Modal.Description>
          <Modal.Description>
            <h3>Solution:</h3>
            { projectData.solution }
          </Modal.Description>
        </Modal.Content>
      </Modal>
    :
      null
  );
};
