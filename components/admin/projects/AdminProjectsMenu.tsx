import * as React from 'react';
import { Icon, Menu } from 'semantic-ui-react';

interface IAdminProjectsMenuProps {
}

export const AdminProjectsMenu: React.FunctionComponent<IAdminProjectsMenuProps> = (props): JSX.Element => {
  return (
    <Menu fluid>
      <Menu.Item as="a" color="green">
        <Icon name="save" color="green" />
        Save
      </Menu.Item>
      <Menu.Item as="a" color="green">
        <Icon name="cancel" color="orange" />
        Cancel
      </Menu.Item>
      <Menu.Item as="a" color="green">
        <Icon name="book" color="green" />
        Publish
      </Menu.Item>
    </Menu>
  );
};