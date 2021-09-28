import * as React from 'react';
import { Icon, Menu } from 'semantic-ui-react';

interface IAdminProjectsMenuProps {
  menuSaveBtnClick(): Promise<any>;
  menuCancelBtnClick(): void;
  menuPublishClick(): Promise<any>;
}

export const AdminProjectsMenu: React.FunctionComponent<IAdminProjectsMenuProps> = ({ menuSaveBtnClick, menuCancelBtnClick, menuPublishClick }): JSX.Element => {
  return (
    <Menu fluid>
      <Menu.Item as="a" color="green" onClick={ menuSaveBtnClick }>
        <Icon name="save" color="green" />
        Save
      </Menu.Item>
      <Menu.Item as="a" color="green" onClick={ menuCancelBtnClick }>
        <Icon name="cancel" color="orange" />
        Cancel
      </Menu.Item>
      <Menu.Item as="a" color="green" onClick={ menuPublishClick }>
        <Icon name="book" color="green" />
        Publish
      </Menu.Item>
    </Menu>
  );
};