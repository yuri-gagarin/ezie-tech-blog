import * as React from 'react';
import { Dropdown, Icon, Input, Menu } from "semantic-ui-react";

interface IAdminUserMenuProps {

}
export const AdminUserMenu: React.FunctionComponent<IAdminUserMenuProps> = (props): JSX.Element => {
  return (
    <Menu fluid style={{ postion: "relative" }}>
      <Dropdown text="Options" icon="file" className="link item">
        <Dropdown.Menu>
          <Dropdown.Item>
            <Icon name="user" />
            New User
          </Dropdown.Item>
          <Dropdown.Item>
            <Icon name="wrench" />
            Edit User
          </Dropdown.Item>
          <Dropdown.Item>
            <Icon name="trash" />
            Delete User
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            <Icon name="redo" />
            Refresh Data
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Menu.Item
        name='messages'
        
      />
      <Menu.Item
        name='friends'
      />
      <Menu.Menu position='right'>
        <Menu.Item>
          <Input icon='search' placeholder='Search...' />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

