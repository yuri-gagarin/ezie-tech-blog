import * as React from 'react';
import { Dropdown, Grid, Menu } from "semantic-ui-react";
// next imports //
import { useRouter } from 'next/router';
// redux //
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";
import { handleClearCurrentBlogPost } from "../../redux/actions/blogPostActions";
// types //
import type { IGeneralState , IGeneralAppAction} from '../../redux/_types/generalTypes';
import type { MenuItemProps } from "semantic-ui-react";
// styles //
import adminMenuStyles from "../../styles/admin/AdminMenu.module.css";
// helpers //
import { checkEmptyObjVals } from "../_helpers/displayHelpers";

// internal custom types //
type MenuItemVal = "posts" | "projects" | "news" | "users" | "";
interface IAdminMenuProps {

}
export const AdminMenu: React.FunctionComponent<IAdminMenuProps> = (props): JSX.Element => {
  // local component hooks //
  const [ activeMenuItem, setActiveMenuItem ] = React.useState<MenuItemVal>("");
  // next hooks //
  const router = useRouter();
  // redux hooks //
  const dispatch = useDispatch<Dispatch<IGeneralAppAction>>();
  const { currentBlogPost } = useSelector((state: IGeneralState) => state.blogPostsState);

  // action handlers //
  const handleGoToNewPost = (): void => {
    // clear current blog post if any //
    if (!checkEmptyObjVals(currentBlogPost)) handleClearCurrentBlogPost(dispatch);
    router.push("/admin/dashboard/posts/new");
  };
  const handleMenuItemClick = (_, data: MenuItemProps ) => {
    const name = data.name as MenuItemVal;
    switch(name) {
      case "posts": {
        router.push("/admin/dashboard/posts");
        setActiveMenuItem("posts");
        break
      }
      case "projects": {
        router.push("/admin/dashboard/projects");
        setActiveMenuItem("projects");
        break;
      }
      case "news": {
        router.push("/admin/dashboard/news");
        setActiveMenuItem("news");
        break;
      }
      case "users": {
        router.push("/admin/dashboard/users");
        setActiveMenuItem("users");
        break;
      } 
      default: setActiveMenuItem("");
    }
  };

  // lifecycle hooks //
  React.useEffect(() => {
    if (router.pathname.includes("/dashboard/posts")) {
      setActiveMenuItem("posts");
    } else if (router.pathname.includes("/dashboard/projects")) {
      setActiveMenuItem("projects");
    } else if (router.pathname.includes("/dashboard/news")) {
      setActiveMenuItem("news");
    } else if(router.pathname.includes("/dashboard/users")) {
      setActiveMenuItem("users");
    } else {
      setActiveMenuItem("");
    }
  }, [ router.pathname ]);

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
            <Dropdown.Item text='Publish To Web' disabled={ checkEmptyObjVals(currentBlogPost) } />
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="posts" active={ activeMenuItem === "posts" }>
            View Posts
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="projects" active={ activeMenuItem === "projects" }>
            View Projects
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="news" active={ activeMenuItem === "news" }>
            View News
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <Menu.Item as="a" onClick={ handleMenuItemClick } name="users" active={ activeMenuItem === "users" }>
            View Users
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Grid.Row>
  );
};

