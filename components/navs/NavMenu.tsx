import React from 'react';
import { Grid, Input, Menu, MenuItemProps } from 'semantic-ui-react';
// next imports //
import { useRouter } from "next/router";
// styles //
import navMenuStyle from "../../styles/NavMenu.module.css";

type NavValues = "home" | "news" | "blog" | "about";
type NavbarState = {
  activeItem: NavValues;
};

export const NavMenu: React.FC<{}> = (): JSX.Element => {
  // local component state and hooks //
  const [ navState, setNavState ] = React.useState<NavbarState>({ activeItem: "home" });
  // next hooks //
  const router = useRouter();

  // action handlers //
  const handleNavClick = (_, data: MenuItemProps): void => {
    const menuPath: NavValues = data.name as NavValues;
    menuPath === "home" ? router.push("/") : router.push(`/${menuPath}`);
    setNavState({ activeItem: menuPath });
  };

  // lifecycle hooks //
  React.useEffect(() => {
    if (router.route === "/" && navState.activeItem !== "home") setNavState({ activeItem: "home" });
    if (router.route === "/blog" && navState.activeItem !== "blog") setNavState({ activeItem: "blog" });
    if (router.route === "/news" && navState.activeItem !== "news") setNavState({ activeItem: "news" });
    if (router.route === "/about" && navState.activeItem !== "about") setNavState({ activeItem: "about" });
  }, [ router.route ]);

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
          <Menu.Item color="purple">
            <Input inverted icon='search' placeholder='Search...' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Grid.Row>
  );
};