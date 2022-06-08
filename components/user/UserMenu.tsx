import * as React from 'react';
import { Dropdown, Grid, Icon, Menu } from "semantic-ui-react";
// next imports //
import { useRouter } from 'next/router';
// redux //
import { useDispatch, useSelector } from "react-redux";
import { BlogPostActions } from "@/redux/actions/blogPostActions";
import { AuthActions } from "@/redux/actions/authActions";
// types //
import type { Dispatch } from "redux";
import type { IGeneralState , IGeneralAppAction} from '@/redux/_types/generalTypes';
import type { DropdownItemProps, MenuItemProps } from "semantic-ui-react";
// styles //
import userMenuStyles from "@/styles/user/UserMenu.module.css";
// helpers //
import { checkEmptyObjVals } from "../_helpers/displayHelpers";

// internal custom types //
type MenuItemVal = "dashboard" | "posts" | "profile" | "";
type LocalState = {
  activeMenuItem: MenuItemVal;
  showUserMenu: boolean;
}
interface IUserMenuProps {

}
export const UserMenu: React.FunctionComponent<IUserMenuProps> = (props): JSX.Element => {
  // local component hooks and local state  //
  const [ LocalState, setLocalState ] = React.useState<LocalState>({ activeMenuItem: "dashboard", showUserMenu: false });
  // next hooks //
  const router = useRouter();
  // redux hooks //
  const dispatch = useDispatch<Dispatch<IGeneralAppAction>>();
  const { currentBlogPost, currentSelectedProject, authState } = useSelector((state: IGeneralState) => {
    return {
      authState: state.authState,
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
        router.push("/user/dashboard/posts/editor");
        break;
      }
      default: return;
    }
    // clear current blog post if any //
    if (!checkEmptyObjVals(currentBlogPost)) BlogPostActions.handleClearCurrentBlogPost(dispatch);
    router.push("/user/dashboard/posts/editor");
  };
  const handleMenuItemClick = (_, data: MenuItemProps ) => {
    const name = data.name as MenuItemVal;
    if (name === LocalState.activeMenuItem) return; // dont reload same page //
    switch (name) {
      case "dashboard": {
        router.push("/user/dashboard");
        setLocalState({ activeMenuItem: "dashboard", showUserMenu: false });
        break;
      }
      case "posts": {
        router.push("/user/dashboard/posts");
        setLocalState({ activeMenuItem: "posts", showUserMenu: false });
        break;
      }
      case "profile": {
        router.push("/user/dashboard/profile");
        setLocalState({ activeMenuItem: "profile", showUserMenu: true });
        break;
      } 
      default: setLocalState({ activeMenuItem: "", showUserMenu: false });
    }
  };

  const handleLogout = async () => {
    try {
      await AuthActions.handleLogout(dispatch);
      router.push("/login");
    } catch (err) {
      AuthActions.handleAuthError(dispatch, err);
    }
  };

  // lifecycle hooks //
  React.useEffect(() => {
    if (router.pathname.includes("/dashboard/posts")) {
      setLocalState({ activeMenuItem: "posts", showUserMenu: false });
    } else if (router.pathname.includes("/dashboard/profile")) {
      setLocalState({ activeMenuItem: "profile", showUserMenu: false });
    } else {
      setLocalState({ activeMenuItem: "dashboard", showUserMenu: false });
    }
  }, [ router.pathname ]);

  /*
  React.useEffect(() => {
    console.log(authState)
  }, [ authState ])
  */
 
  return (
    <Grid.Row className={ userMenuStyles.userMenuRow }>
      <Menu pointing color="violet" fluid fixed="top" className={ userMenuStyles.fixedUserMenu } data-test-id="user-main-menu">
        <Dropdown text='File' className={ `${userMenuStyles.UserMenuFile} link item` } data-test-id={"main-file-dropdown"}>
          <Dropdown.Menu style={{ zIndex: 9999 }}>
            <Dropdown.Item>
              <Dropdown text='New' pointing="left" data-test-id={"new-file-menu"}>
                <Dropdown.Menu style={{ left: "140px", transform: "translateY(-12px)"}}>
                  <Dropdown.Item onClick={ handleGoToNew } value="post" data-test-id="Go_To_New_Blog_Post_Option">Blog Post</Dropdown.Item>                 
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
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="dashboard" active={ LocalState.activeMenuItem === "dashboard" } data-test-id="Main_User_Dash_Link">
            Dashboard
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="posts" active={ LocalState.activeMenuItem === "posts" } data-test-id="Main_User_Posts_Link">
            View Posts
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item link={false}>
            <Icon name="user circle" />
          </Menu.Item>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="profile" active={ LocalState.activeMenuItem === "profile" } data-test-id="Main_User_Users_Link">
            View My Profile
          </Menu.Item>
          <Menu.Item onClick={ handleLogout } data-test-id="user-main-logout-link">
            Logout
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Grid.Row>
  );
};

