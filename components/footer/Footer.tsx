import * as React from 'react';
import { Icon, Menu } from "semantic-ui-react";
// styles //
import footerStyles from "../../styles/footer/Footer.module.css";

interface IFooterProps {
}

const Footer: React.FunctionComponent<IFooterProps> = (props): JSX.Element => {
  
  const handleSocialClick = (): void => {

  };

  return (
    <div className={ footerStyles.footerWrapper }>
      <Menu fluid inverted>
        <Menu.Menu position="left">
          <Menu.Item
            name="instagram"
            onClick={ handleSocialClick }
          >
            <Icon name="instagram" />
          </Menu.Item>
          <Menu.Item
            name="facebook"
            onClick={ handleSocialClick }
          >
            <Icon name="facebook" />
          </Menu.Item>
          <Menu.Item
            name="twitter"
            onClick={ handleSocialClick }
          >
            <Icon name="twitter" />
          </Menu.Item>
        </Menu.Menu>  
        <Menu.Menu position="right">
          <Menu.Item 
            as="segment" 
            content="Copyright © Yuriy Ivanov 2021"
          /> 
        </Menu.Menu>
      </Menu>  
    </div>
  )
};

export default Footer;
