import * as React from 'react';
import { Dropdown, Grid, Menu } from "semantic-ui-react";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
// styles //
import adminMenuStyles from "../../styles/admin/AdminMenu.module.css";
import { IGeneralState } from '../../redux/_types/generalTypes';

interface IAdminMenuProps {
}

export const AdminMenu: React.FunctionComponent<IAdminMenuProps> = (props): JSX.Element => {

  const router = useRouter();
  const { usersState, blogPostsState } = useSelector((state: IGeneralState) => state);

  const handleGoToNewPost = (): void => {
    router.push("/admin/dashboard/posts/new");
  };

  React.useEffect(() => {
  }, []);

  return (
    <Grid.Row className={ adminMenuStyles.adminMenuRow } >
      <Menu fluid fixed="top" className={ adminMenuStyles.fixedAdminMenu }>
        <Dropdown text='File' className={ adminMenuStyles.adminMenuFile }>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Dropdown text='New' pointing="left">
                <Dropdown.Menu style={{ left: "140px" }}>
                  <Dropdown.Item onClick={ handleGoToNewPost } >Blog Post</Dropdown.Item >
                  <Dropdown.Item>Project</Dropdown.Item>
                  <Dropdown.Item>News Post</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item>User</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Dropdown.Item>
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

