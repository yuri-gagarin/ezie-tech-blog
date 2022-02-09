import * as React from 'react';
// 
import { Button, Icon, Menu } from "semantic-ui-react";

interface IAuthNavProps {
  handleGoBack(): void;
  handleGoHome(): void;
}

export const AuthNav: React.FunctionComponent<IAuthNavProps> = ({ handleGoBack, handleGoHome }): JSX.Element => {
  return (
    <Menu>
      <Menu.Item>
        <Button basic color='green' onClick={ handleGoBack }>
          <Icon name="arrow left" color='green' />
          Back
        </Button>
        <Button basic color="blue" onClick={ handleGoHome }>
          <Icon name="home" color="blue" />
          Home
        </Button>
      </Menu.Item>
    </Menu>
  );
};