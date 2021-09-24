import * as React from 'react';
import { Button, Label, List } from "semantic-ui-react";
import { AdminData } from '../../../redux/_types/generalTypes';
// types //
import type { GenUserData } from '../../../redux/_types/users/dataTypes';

interface IAdminRegisteredUsersProps {
  userData: GenUserData
}

export const AdminRegUserListItem: React.FunctionComponent<IAdminRegisteredUsersProps> = ({ userData }): JSX.Element => {
  // local state aand props //
  const [ localState, setLocalState ] = React.useState<{ admin: boolean; adminRole: "admin" | "owner" | ""; }>({ admin: false, adminRole: "" });

  React.useEffect(() => {
    const { role } = (userData as AdminData);
    if (role) setLocalState({ admin: true, adminRole: role });
  }, [ userData ]);
  
  return (
    <List.Item>
      <List.Icon name="user circle" size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header as='a'>
          <Label content="Email:" />
          { userData.email}
        </List.Header>
        <List.Description as="span">
          <Label content="First name:" />
          { userData.firstName ? userData.firstName : "No first name set"}
          <Label content="First name:" />
          { userData.firstName ? userData.firstName : "No first name set"}
        </List.Description>
          <Label content="Admin:" />
          { localState.admin ? "Administrator" : "User" }
        <List.Description>
        </List.Description>
        <List.Description>{ userData.createdAt }</List.Description>
        <List.Description>{ userData.editedAt }</List.Description>
      </List.Content>
      <List.Content floated="right">
        <Button.Group>
          <Button basic color="green" icon="file" content="View"/>
          <Button basic color="orange" icon="wrench" content="Edit" />
        </Button.Group>
      </List.Content>
    </List.Item>
  );
};
