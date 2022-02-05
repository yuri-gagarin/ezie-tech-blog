import * as React from 'react';
import { UserMenu } from './UserMenu';

interface IUserLayoutProps {
}

export const UserLayout: React.FunctionComponent<IUserLayoutProps> = ({ children }): JSX.Element => {
  return (
    <React.Fragment>
      <UserMenu />
      {  children }
    </React.Fragment>
  );
};

