import * as React from 'react';
import { Dropdown, Grid, Menu } from "semantic-ui-react";
// next imports //
import { useRouter } from 'next/router';
// redux //
import { useDispatch, useSelector } from "react-redux";
import { BlogPostActions } from "@/redux/actions/blogPostActions";
import { ProjectActions } from "@/redux/actions/projectActions";
import { AuthActions } from "@/redux/actions/authActions";
// types //
import type { Dispatch } from "redux";
import type { IGeneralState , IGeneralAppAction} from '../../redux/_types/generalTypes';
import type { DropdownItemProps, MenuItemProps } from "semantic-ui-react";
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
  const { currentBlogPost, currentSelectedProject } = useSelector((state: IGeneralState) => {
    return {
      currentBlogPost: state.blogPostsState.currentBlogPost,
      currentSelectedProject: state.projectsState.currentSelectedProject
    };
  });

  // action handlers //
  const handleGoToNew = (e, data: DropdownItemProps): void => {
    const option = data.value as string;
    switch (option) {
      case "post": {
        if (!checkEmptyObjVals(currentBlogPost)) BlogPostActions.handleClearCurrentBlogPost(dispatch);
        router.push("/admin/dashboard/posts/new");
        break;
      }
      case "project": {
        if (!currentSelectedProject) ProjectActions.handleClearCurrentProjData({ dispatch });
        router.push("/admin/dashboard/projects/editor");
        break;
      }
      default: return;
    }
    // clear current blog post if any //
    if (!checkEmptyObjVals(currentBlogPost)) BlogPostActions.handleClearCurrentBlogPost(dispatch);
    router.push("/admin/dashboard/posts/new");
  };
  const handleMenuItemClick = (_, data: MenuItemProps ) => {
    const name = data.name as MenuItemVal;
    if (name === LocalState.activeMenuItem) return; // dont reload same page //
    switch (name) {
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
      <Menu pointing color="violet" fluid fixed="top" className={ adminMenuStyles.fixedAdminMenu } data-test-id="Admin_Main_Menu">
        <Dropdown text='File' className={ `${adminMenuStyles.adminMenuFile} link item` } data-test-id={"Main_File_Dropdown"}>
          <Dropdown.Menu style={{ zIndex: 9999 }}>
            <Dropdown.Item>
              <Dropdown text='New' pointing="left" data-test-id={"New_File_Menu"}>
                <Dropdown.Menu style={{ left: "140px", transform: "translateY(-12px)"}}>
                  <Dropdown.Item onClick={ handleGoToNew } value="post" data-test-id="Go_To_New_Blog_Post_Option">Blog Post</Dropdown.Item>
                  <Dropdown.Item onClick={ handleGoToNew } value="project" data-test-id="Go_To_New_Project_Option">Project</Dropdown.Item>
                  <Dropdown.Item>News Post</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item data-test-id="Go_To_New_Project_Option">User</Dropdown.Item>
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
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="dashboard" active={ LocalState.activeMenuItem === "dashboard" } data-test-id="Main_Admin_Dash_Link">
            Dashboard
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="posts" active={ LocalState.activeMenuItem === "posts" } data-test-id="Main_Admin_Posts_Link">
            View Posts
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="projects" active={ LocalState.activeMenuItem === "projects" } data-test-id="Main_Admin_Projects_Link">
            View Projects
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="news" active={ LocalState.activeMenuItem === "news" } data-test-id="Main_Admin_News_Link">
            View News
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="users" active={ LocalState.activeMenuItem === "users" } data-test-id="Main_Admin_Users_Link">
            View Users
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          {
            <AdminUserMenu />
          }
          <Menu.Item onClick={ handleLogout } data-test-id="Admin_Main_Logout_Link">
            Logout
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Grid.Row>
  );
};

