import * as React from 'react';
import { Button, Icon } from "semantic-ui-react";
// styles //
import styles from "../../../styles/admin/AdminPostNav.module.css";

interface IAdminPostNavProps {
  savePost(): Promise<any>;
  cancelNewPost(): void;
}

export const AdminPostNav: React.FunctionComponent<IAdminPostNavProps> = ({ savePost, cancelNewPost }): JSX.Element => {
  return (
    <div className={ styles.adminPostNavWrapper } data-test-id="post-nav-main">  
      <Button.Group>
        <Button color="green" onClick={ savePost } data-test-id="post-save-btn">
          <Icon name="save" />
          Save
        </Button>
        <Button color="orange" onClick={ cancelNewPost } data-test-id="post-cancel-btn">
          <Icon name="cancel" />
          Cancel
        </Button>
      </Button.Group>
    </div>
  );  
};

