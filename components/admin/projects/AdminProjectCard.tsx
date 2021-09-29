import * as React from 'react';
import { Button, Card } from "semantic-ui-react";
// types //
import type { ProjectData } from '@/redux/_types/projects/dataTypes';
// helpers //


interface IAdminProjectCardProps {
  projectData: ProjectData
  openProject(projectId: string): void;
}

export const AdminProjectCard: React.FunctionComponent<IAdminProjectCardProps> = ({ projectData, openProject }): JSX.Element => {
  const { _id: projectId, title, description } = projectData;
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>Title: { title }</Card.Header>
        <Card.Description>Description: { description }</Card.Description>
      </Card.Content>
      <Card.Content>
        <Button.Group>
          <Button icon="file" content="Open" onClick={ () => openProject(projectId) } />
          <Button icon="edit" content="Edit" />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

