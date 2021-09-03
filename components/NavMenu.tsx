import React from 'react';
import { Grid, Input, Menu, MenuItemProps } from 'semantic-ui-react';
//
import { useRouter } from "next/router";
import navMenuStyle from "../styles/NavMenu.module.css";

type NavValues = "home" | "news" | "blog" | "about";
type NavbarState = {
  activeItem: NavValues;
};

export const NavMenu: React.FC<{}> = (): JSX.Element => {
  const [ navState, setNavState ] = React.useState<NavbarState>({ activeItem: "home" });
  const router = useRouter();

  const handleNavClick = (_, data: MenuItemProps): void => {
    const menuPath: NavValues = data.name as NavValues;
    menuPath === "home" ? router.push("/") : router.push(`/${menuPath}`);
    setNavState({ activeItem: menuPath });
  };

  return (
    <Grid.Row className={ navMenuStyle.menuRow }>
      <Menu pointing fluid fixed="top">
        <Menu.Item
          name='home'
          active={ navState.activeItem === "home" }
          onClick={ handleNavClick }
        />
        <Menu.Item
          name='blog'
          active={ navState.activeItem === "blog" }
          onClick={ handleNavClick }
        />
        <Menu.Item
          name='news'
          active={ navState.activeItem === "news" }
          onClick={ handleNavClick }
        />
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Grid.Row>
    
  )
}