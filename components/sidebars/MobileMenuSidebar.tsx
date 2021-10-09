import * as React from 'react';
import { Icon, Menu, Segment, Sidebar } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// types //
import type { MenuItemProps } from "semantic-ui-react";
// styles //
import styles from "@/styles/sidebars/MobileMenuSidebar.module.css";

interface IMobileMenuSidebarProps {
}

export const MobileMenuSidebar: React.FunctionComponent<IMobileMenuSidebarProps> = ({ children }): JSX.Element => {
  const [ sidebarState, setSidebarState ] = React.useState<boolean>(false);
  // next hooks //
  const router = useRouter();

  // action handlers //
  const setVisible = (visible: boolean): void => {
    setSidebarState(visible);
  };
  const handleGoToSection = (_, data: MenuItemProps): void => {
    const name = data.name as "home" | "blog" | "news" | "projects" | "about";
    switch(name) {
      case "home": {
        setSidebarState(false);
        router.push("/");
        break;
      }
      case "blog": {
        setSidebarState(false);
        router.push("/blog");
        break;
      }
      case "news": {
        setSidebarState(false);
        router.push("/news");
        break;
      }
      case "projects": {
        setSidebarState(false);
        router.push("/projects");
        break;
      }
      case "about": {
        setSidebarState(false);
        router.push("/about");
        break;
      }
    }
  };
  const handleGoToLogin = (): void => {
    router.push("/login");
  };

  return (
    <Sidebar.Pushable as={Segment} style={{ margin: 0 }} >
      <div className={ styles.mobileSidebarMenuDiv }>
        <Menu inverted color="violet" className={ styles.mobileSidebarMenu } fluid>
          <Menu.Item content="Menu" icon="options" as="a" onClick={ () => setVisible(true) }/>
          
          <Menu.Item position="right" as="a" icon="user" content="Login" onClick={ handleGoToLogin } />
       
        </Menu>
      </div>
      <Sidebar
        className={ styles.sidebarMain }
        as={Menu}
        animation="push"
        icon="labeled"
        inverted
        onHide={() => setVisible(false)}
        vertical
        visible={ sidebarState }
      >
        <Menu.Item className={ styles.closeMenuBtn } as='a' onClick={ () => setVisible(false) } color="black">
          <Icon name='close' />
          Close
        </Menu.Item>
        <Menu.Item as='a' name="home" onClick={ handleGoToSection }>
          <Icon name="home" />
          Home
        </Menu.Item>
        <Menu.Item as='a' name="blog" onClick={ handleGoToSection }>
          <Icon name="newspaper" />
          Blog
        </Menu.Item>
        <Menu.Item as='a' name="news" onClick={ handleGoToSection }> 
          <Icon name="rss" />
          News
        </Menu.Item>
        <Menu.Item as='a' name="projects" onClick={ handleGoToSection }>
          <Icon name="product hunt" />
          Projects
        </Menu.Item>
        <Menu.Item as='a' name="about" onClick={ handleGoToSection }>
          <Icon name="question circle" />
          About 
        </Menu.Item>
      </Sidebar>

      <Sidebar.Pusher className={ styles.mobileMenuPusher } > 
        { children }
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

