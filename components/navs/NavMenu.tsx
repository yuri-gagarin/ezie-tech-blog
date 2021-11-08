import React from 'react';
import { Button, Grid, Input, Menu, MenuItemProps } from 'semantic-ui-react';
// next imports //
import { useRouter } from "next/router";
// redux imports //
import { useSelector, useDispatch } from "react-redux";
import { AuthActions } from "../../redux/actions/authActions";
// additonal components //
// types //
import type { Dispatch } from "redux";
import type { AuthAction } from "../../redux/_types/auth/actionTypes";
import type { IGeneralState } from "../../redux/_types/generalTypes";
// styles //
import navMenuStyle from "../../styles/NavMenu.module.css";
import { GenErrorModal } from '../modals/GenErrorModal';
import { AnimatedHomeNav } from './AnimatedHomeNav';

type NavValues = "home" | "news" | "blog" | "projects" | "about";
type NavbarState = {
  activeItem: NavValues;
  showSearchBar: boolean;
};

//  MENU should not be show on login, register and any admin pages //
export const NavMenu: React.FC<{}> = (): JSX.Element | null => {
  // local component state and hooks //
  const [ navState, setNavState ] = React.useState<NavbarState>({ activeItem: "home", showSearchBar: false });
  const [ showMenu, setShowMenu ] = React.useState<boolean>(true);
  const [ animMenuState, setAnimMenuState ] = React.useState<{ show: boolean; transformY: string; }>({ show: true, transformY: '0px'});
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<AuthAction>>()
  const { authState } = useSelector((state: IGeneralState) => state);
  const { loggedIn, currentUser, error, errorMessages } = authState;


  // custom listners //
 
  // action handlers //
  const handleNavClick = (_, data: MenuItemProps): void => {
    const menuPath: NavValues = data.name as NavValues;
    menuPath === "home" ? router.push("/") : router.push(`/${menuPath}`);
    setNavState({ activeItem: menuPath, showSearchBar: menuPath === "blog" ? true : false });
  };
  const handleGoToLogin = (): void => {
    router.push("/login");
  };
  const handleLogout = async (): Promise<any> => {
    try {
      await AuthActions.handleLogout(dispatch);
      router.push("/");
    } catch (error) {
      AuthActions.handleAuthError(dispatch, error);
    }
  };
  const handleErrorModalClose = (): void => {
    AuthActions.dismissAuthError(dispatch);
  };
  const handleScrollToContent = async (e: React.MouseEvent<HTMLDivElement>, data: { value?: string }): Promise<any> => {
    const { value } = data;
    if (!value) return;

    enum ElemId { news = "homeNewsRow", blog = "homeLatestBlogRow", project = "homeProjectsRow" };
    let elementId: string;

    switch(value) {
      case "news": {
        elementId = ElemId.news;
        break;
      }
      case "blog": {
        elementId = ElemId.blog;
        break;
      }
      case "project": {
        elementId = ElemId.project;
        break;
      }
      case "about": {
        return router.push("/about");
      }
      default: {
        elementId = "";
      }
    }
    const element = document.getElementById(elementId);
    if (element) element.scrollIntoView({ behavior: "smooth" });

  };

  // lifecycle hooks //
  React.useEffect(() => {
    if (router.route === "/" && navState.activeItem !== "home") setNavState({ activeItem: "home", showSearchBar: false });
    else if (router.route.includes("/blog") && navState.activeItem !== "blog") setNavState({  activeItem: "blog", showSearchBar: true });
    else if (router.route.includes("/news") && navState.activeItem !== "news") setNavState({ activeItem: "news", showSearchBar: false });
    else if (router.route.includes("/projects") && navState.activeItem !== "projects") setNavState({ activeItem: "projects", showSearchBar: false });
    else if (router.route.includes("/about") && navState.activeItem !== "about") setNavState({ activeItem: "about", showSearchBar: false });
    //else setNavState({ activeItem: "home", showSearchBar: false });
  }, [ router.route, navState.activeItem ]);

  React.useEffect(() => {
    const homePageScrollEventListener = (): void => {
      if (window.scrollY > 100) setAnimMenuState({ show: false, transformY: `-${window.scrollY}px` });
      else setAnimMenuState({ show: true, transformY: `-${window.scrollY}px` });
     
    };
    if (router.route.includes("admin") || router.route.includes("login") || router.route.includes("register")) {
      setShowMenu(false);
    } else {
      setShowMenu(true);
    }

    if (router.route === "/") {
      window.addEventListener("scroll", homePageScrollEventListener);
      if (window.scrollY < 100) setAnimMenuState({ show: true, transformY: "0px" })
    }

    if (router.route !== "/") {
      setAnimMenuState({ show: false, transformY: "0px" });
    }

    return () => {
      window.removeEventListener("scroll", homePageScrollEventListener);
    }
  }, [ router.route ]);


  return (
    showMenu 
    ?
    (
      animMenuState.show
      ?
      <div className={ navMenuStyle.animatedMenuRow } style={{ transform: `translateY(${animMenuState.transformY})`}}>
        <AnimatedHomeNav handleScrollToContent={ handleScrollToContent } />
      </div>
      :
      <Grid.Row className={ `${navMenuStyle.menuRow} ${navMenuStyle.fadeIn}` } data-test-id="Main_Menu">
        <GenErrorModal 
          open={ error ? true : false }
          handleErrorModalClose={ handleErrorModalClose }
          header={ "Logout Error" }
          errorMessages={ errorMessages }
          position={ "fixed-top" }
        />
        <Menu pointing fluid inverted fixed="top" className={ navMenuStyle.mainNav }>
          <Menu.Item
            className={ navMenuStyle.navMenuItem }
            name='home'
            active={ navState.activeItem === "home" }
            onClick={ handleNavClick }
            color="purple"
            data-test-id="Main_Menu_Home_Link"
          />
          <Menu.Item
            className={ navMenuStyle.navMenuItem }
            name='blog'
            active={ navState.activeItem === "blog" }
            onClick={ handleNavClick }
            color="purple"
            data-test-id="Main_Menu_Blog_Link"
          />
          <Menu.Item
            className={ navMenuStyle.navMenuItem }
            name='news'
            active={ navState.activeItem === "news" }
            onClick={ handleNavClick }
            color="purple"
            data-test-id="Main_Menu_News_Link"
          />
          <Menu.Item
            className={ navMenuStyle.navMenuItem }
            name='projects'
            active={ navState.activeItem === "projects" }
            onClick={ handleNavClick }
            color="purple"
            data-test-id="Main_Menu_Projects_Link"
          />
          <Menu.Item
              className={ navMenuStyle.navMenuItem }
              name='about'
              active={ navState.activeItem === "about" }
              onClick={ handleNavClick }
              color="purple"
              data-test-id="Main_Menu_About_Link"
          />
          <Menu.Menu position='right'>
            {
              navState.showSearchBar 
              ?
              <Menu.Item color="purple">
                <Input inverted icon='search' placeholder='Search...' />
              </Menu.Item>
              :
              null
            }
           
            <Menu.Item>
              { 
                loggedIn && currentUser 
                ?
                (
                  router.pathname.includes("/admin") 
                  ?
                  null
                  :
                  <Button inverted color="purple" content="Logout" onClick={ handleLogout } data-test-id="Main_Menu_Logout_link" />
                )
                :
                <Button inverted color="purple" content="Login" onClick={ handleGoToLogin } data-test-id="Main_Menu_Login_Link" />
              }
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Grid.Row>
    )
    :
    null
  );
};