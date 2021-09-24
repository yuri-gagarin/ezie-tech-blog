import * as React from 'react';
import { Dropdown, Grid, Menu } from "semantic-ui-react";
// next imports //
import { useRouter } from 'next/router';
// redux //
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";
import { BlogPostActions } from "../../redux/actions/blogPostActions";
import { AuthActions } from "../../redux/actions/authActions";
// types //
import type { IGeneralState , IGeneralAppAction} from '../../redux/_types/generalTypes';
import type { MenuItemProps } from "semantic-ui-react";
// styles //
import adminMenuStyles from "../../styles/admin/AdminMenu.module.css";
// helpers //
import { checkEmptyObjVals } from "../_helpers/displayHelpers";
import { AdminUserMenu } from './users/AdminUserMenu';

// internal custom types //
type MenuItemVal = "dashboard" | "posts" | "projects" | "news" | "users" | "";
type LocalState = {
  activeMenuItem: MenuItemVal;
  showUserMenu: boolean;
}
interface IAdminMenuProps {

}
export const AdminMenu: React.FunctionComponent<IAdminMenuProps> = (props): JSX.Element => {
  // local component hooks and local state  //
  const [ LocalState, setLocalState ] = React.useState<LocalState>({ activeMenuItem: "dashboard", showUserMenu: false });
  // next hooks //
  const router = useRouter();
  // redux hooks //
  const dispatch = useDispatch<Dispatch<IGeneralAppAction>>();
  const { currentBlogPost } = useSelector((state: IGeneralState) => state.blogPostsState);

  // action handlers //
  const handleGoToNewPost = (): void => {
    // clear current blog post if any //
    if (!checkEmptyObjVals(currentBlogPost)) BlogPostActions.handleClearCurrentBlogPost(dispatch);
    router.push("/admin/dashboard/posts/new");
  };
  const handleMenuItemClick = (_, data: MenuItemProps ) => {
    const name = data.name as MenuItemVal;
    switch(name) {
      case "dashboard": {
        router.push("/admin/dashboard");
        setLocalState({ activeMenuItem: "dashboard", showUserMenu: false });
        break;
      }
      case "posts": {
        router.push("/admin/dashboard/posts");
        setLocalState({ activeMenuItem: "posts", showUserMenu: false });
        break;
      }
      case "projects": {
        router.push("/admin/dashboard/projects");
        setLocalState({ activeMenuItem: "projects", showUserMenu: false });
        break;
      }
      case "news": {
        router.push("/admin/dashboard/news");
        setLocalState({ activeMenuItem: "news", showUserMenu: false });
        break;
      }
      case "users": {
        router.push("/admin/dashboard/users");
        setLocalState({ activeMenuItem: "users", showUserMenu: true });
        break;
      } 
      default: setLocalState({ activeMenuItem: "", showUserMenu: false });
    }
  };

  const handleLogout = async () => {
    try {
      await AuthActions.handleLogout(dispatch);
      router.push("/");
    } catch (err) {
      AuthActions.handleAuthError(dispatch, err);
    }
  };

  // lifecycle hooks //
  React.useEffect(() => {
    if (router.pathname.includes("/dashboard/posts")) {
      setLocalState({ activeMenuItem: "posts", showUserMenu: false });
    } else if (router.pathname.includes("/dashboard/projects")) {
      setLocalState({ activeMenuItem: "projects", showUserMenu: false });
    } else if (router.pathname.includes("/dashboard/news")) {
      setLocalState({ activeMenuItem: "news", showUserMenu: false });
    } else if(router.pathname.includes("/dashboard/users")) {
      setLocalState({ activeMenuItem: "users", showUserMenu: true });
    } else {
      setLocalState({ activeMenuItem: "dashboard", showUserMenu: false });
    }
  }, [ router.pathname ]);

  return (
    <Grid.Row className={ adminMenuStyles.adminMenuRow } >
      <Menu pointing color="violet" fluid fixed="top" className={ adminMenuStyles.fixedAdminMenu }>
        <Dropdown text='File' className={ `${adminMenuStyles.adminMenuFile} link item` }>
          <Dropdown.Menu style={{ zIndex: 9999 }}>
            <Dropdown.Item>
              <Dropdown text='New' pointing="left">
                <Dropdown.Menu style={{ left: "140px", transform: "translateY(-12px)"}}>
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
            <Dropdown.Item text='Publish To Web' disabled={ checkEmptyObjVals(currentBlogPost) } />
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="dashboard" active={ LocalState.activeMenuItem === "dashboard" }>
            Dashboard
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="posts" active={ LocalState.activeMenuItem === "posts" }>
            View Posts
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="projects" active={ LocalState.activeMenuItem === "projects" }>
            View Projects
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="news" active={ LocalState.activeMenuItem === "news" }>
            View News
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="users" active={ LocalState.activeMenuItem === "users" }>
            View Users
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          {
            <AdminUserMenu />
          }
          <Menu.Item onClick={ handleLogout }>
            Logout
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Grid.Row>
  );
};

