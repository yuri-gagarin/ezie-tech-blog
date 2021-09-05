import * as React from 'react';
import { AdminMenu } from './AdminMenu';

interface IAdminLayoutProps {
}

export const AdminLayout: React.FunctionComponent<IAdminLayoutProps> = ({ children }): JSX.Element => {
  return (
    <React.Fragment>
      <AdminMenu />
      {  children }
    </React.Fragment>
  );
};

