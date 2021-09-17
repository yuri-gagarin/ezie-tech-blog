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
    <div className={ styles.adminPostNavWrapper }>  
      <Button.Group>
        <Button color="green" onClick={ savePost }>
          <Icon name="save" />
          Save
        </Button>
        <Button color="orange" onClick={ cancelNewPost }>
          <Icon name="cancel" />
          Cancel
        </Button>
      </Button.Group>
    </div>
  );  
};

