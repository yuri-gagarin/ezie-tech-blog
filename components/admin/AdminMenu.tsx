import * as React from 'react';
import { Dropdown, Grid, Menu } from "semantic-ui-react";
// styles //
import adminMenuStyles from "../../styles/admin/AdminMenu.module.css";

interface IAdminMenuProps {
}

export const AdminMenu: React.FunctionComponent<IAdminMenuProps> = (props): JSX.Element => {
  return (
    <Grid.Row className={ adminMenuStyles.adminMenuRow } >
      <Menu fluid fixed="top" className={ adminMenuStyles.fixedAdminMenu }>
        <Dropdown text='File' className={ adminMenuStyles.adminMenuFile }>
          <Dropdown.Menu>
            <Dropdown.Item text='New' />
            <Dropdown.Item text='Open...' description='ctrl + o' />
            <Dropdown.Item text='Save...' description='ctrl + s' />
            <Dropdown.Item text='Rename' description='ctrl + r' />
            <Dropdown.Item icon='folder' text='Move to folder' />
            <Dropdown.Item icon='trash' text='Move to trash' />
            <Dropdown.Divider />
            <Dropdown.Item text='Download As...' />
            <Dropdown.Item text='Publish To Web' />
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu>
          <Menu.Item as="a">
            Posts
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Grid.Row>
  );
};

