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

type NavValues = "home" | "news" | "blog" | "about";
type NavbarState = {
  activeItem: NavValues;
  showSearchBar: boolean;
};

//  MENU should not be show on login, register and any admin pages //
export const NavMenu: React.FC<{}> = (): JSX.Element | null => {
  // local component state and hooks //
  const [ navState, setNavState ] = React.useState<NavbarState>({ activeItem: "home", showSearchBar: false });
  const [ showMenu, setShowMenu ] = React.useState<boolean>(true);
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<AuthAction>>()
  const { authState } = useSelector((state: IGeneralState) => state);
  const { loggedIn, currentUser, error, errorMessages } = authState;

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

  // lifecycle hooks //
  React.useEffect(() => {
    if (router.route === "/" && navState.activeItem !== "home") setNavState({ activeItem: "home", showSearchBar: false });
    else if (router.route === "/blog" && navState.activeItem !== "blog") setNavState({  activeItem: "blog", showSearchBar: true });
    else if (router.route === "/news" && navState.activeItem !== "news") setNavState({ activeItem: "news", showSearchBar: false });
    else if (router.route === "/about" && navState.activeItem !== "about") setNavState({ activeItem: "about", showSearchBar: false });
    //else setNavState({ activeItem: "home", showSearchBar: false });
  }, [ router.route, navState.activeItem ]);

  React.useEffect(() => {
    if (router.route.includes("admin") || router.route.includes("login") || router.route.includes("register")) {
      setShowMenu(false);
    } else {
      setShowMenu(true);
    }
  }, [ router.route ]);

  return (
    showMenu 
    ?
    <Grid.Row className={ navMenuStyle.menuRow }>
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
        />
        <Menu.Item
          className={ navMenuStyle.navMenuItem }
          name='blog'
          active={ navState.activeItem === "blog" }
          onClick={ handleNavClick }
          color="purple"
        />
        <Menu.Item
          className={ navMenuStyle.navMenuItem }
          name='news'
          active={ navState.activeItem === "news" }
          onClick={ handleNavClick }
          color="purple"
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
                <Button inverted color="purple" content="Logout" onClick={ handleLogout } />
              )
              :
              <Button inverted color="purple" content="Login" onClick={ handleGoToLogin } />
            }
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Grid.Row>
    :
    null
  );
};