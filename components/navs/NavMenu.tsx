import React from 'react';
import { Button, Grid, Input, Menu, MenuItemProps } from 'semantic-ui-react';
// next imports //
import { useRouter } from "next/router";
// redux imports //
import { useSelector } from "react-redux";
// types //
import { IAuthState, IGeneralState } from "../../redux/_types/generalTypes";
// styles //
import navMenuStyle from "../../styles/NavMenu.module.css";
import { checkEmptyObjVals } from '../_helpers/displayHelpers';

type NavValues = "home" | "news" | "blog" | "about";
type NavbarState = {
  activeItem: NavValues;
  showSearchBar: boolean;
};

export const NavMenu: React.FC<{}> = (): JSX.Element => {
  // local component state and hooks //
  const [ navState, setNavState ] = React.useState<NavbarState>({ activeItem: "home", showSearchBar: false });
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const { authState } = useSelector((state: IGeneralState) => state);
  const { loggedIn, currentUser } = authState;

  // action handlers //
  const handleNavClick = (_, data: MenuItemProps): void => {
    const menuPath: NavValues = data.name as NavValues;
    menuPath === "home" ? router.push("/") : router.push(`/${menuPath}`);
    setNavState({ activeItem: menuPath, showSearchBar: menuPath === "blog" ? true : false });
  };
  const handleGoToLogin = (): void => {
    router.push("/login");
  };
  const handleLogout = (): void => {

  }
  // lifecycle hooks //
  React.useEffect(() => {
    if (router.route === "/" && navState.activeItem !== "home") setNavState({ activeItem: "home", showSearchBar: false });
    else if (router.route === "/blog" && navState.activeItem !== "blog") setNavState({  activeItem: "blog", showSearchBar: true });
    else if (router.route === "/news" && navState.activeItem !== "news") setNavState({ activeItem: "news", showSearchBar: false });
    else if (router.route === "/about" && navState.activeItem !== "about") setNavState({ activeItem: "about", showSearchBar: false });
    //else setNavState({ activeItem: "home", showSearchBar: false });
  }, [ router.route, navState.activeItem ]);

  return (
    <Grid.Row className={ navMenuStyle.menuRow }>
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
              <Button inverted color="purple" content="Logout" />
              :
              <Button inverted color="purple" content="Login" onClick={ handleGoToLogin } />
            }
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Grid.Row>
  );
};