import * as React from 'react';
import { Button, Icon } from "semantic-ui-react";
// styles //
import styles from "@/styles/admin/users_pages/AdminUserNav.module.css";

interface IAdminUserNavProps {
  saveUser(): Promise<any>;
  cancelNewUser(): void;
  handleMuteUser(): Promise<any>;
};

export const AdminUserNav: React.FunctionComponent<IAdminUserNavProps> = ({ saveUser, cancelNewUser, handleMuteUser }): JSX.Element => {
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
        <Button basic color="purple" onClick={ handleMuteUser } data-test-id="admin-user-mute-btn">
          <Icon name="microphone slash" />
          Mute
        </Button>
        <Button basic color="orange" data-test-id="admin-user-warn-btn">
          <Icon name="exclamation triangle" />
          Warn
        </Button>
      </Button.Group>
    </div>
  );  
};

