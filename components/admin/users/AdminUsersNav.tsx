import * as React from 'react';
import { Button, Icon } from "semantic-ui-react";
// styles //
import styles from "@/styles/admin/AdminUserNav.module.css";

interface IAdminUserNavProps {
  saveUser(): Promise<any>;
  cancelNewUser(): void;
}

export const AdminUserNav: React.FunctionComponent<IAdminUserNavProps> = ({ saveUser, cancelNewUser }): JSX.Element => {
  return (
    <div className={ styles.adminUserNavWrapper } data-test-id="admin-user-nav-main">  
      <Button.Group>
        <Button color="green" onClick={ saveUser } data-test-id="admin-user-save-btn">
          <Icon name="save" />
          Save
        </Button>
        <Button color="orange" onClick={ cancelNewUser } data-test-id="admin-user-cancel-btn">
          <Icon name="cancel" />
          Cancel
        </Button>
      </Button.Group>
    </div>
  );  
};

