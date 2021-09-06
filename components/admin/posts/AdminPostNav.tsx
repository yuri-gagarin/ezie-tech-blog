import * as React from 'react';
import { Button, Icon } from "semantic-ui-react";
// styles //
import styles from "../../../styles/admin/AdminPostNav.module.css";

interface IAdminPostNavProps {
}

export const AdminPostNav: React.FunctionComponent<IAdminPostNavProps> = (props): JSX.Element => {
  return (
    <div className={ styles.adminPostNavWrapper }>  
      <Button.Group>
        <Button color="green">
          <Icon name="save" />
          Save
        </Button>
        <Button color="orange">
          <Icon name="cancel" />
          Cancel
        </Button>
      </Button.Group>
    </div>
  );  
};

