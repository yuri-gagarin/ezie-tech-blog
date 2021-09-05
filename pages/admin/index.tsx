import * as React from 'react';
import { Button, Form, Grid } from "semantic-ui-react";
// styles //
import styles from "../../styles/admin/AdminLogin.module.css";

interface IAdminLoginProps {
}

const Admin: React.FunctionComponent<IAdminLoginProps> = (props): JSX.Element => {
  return (
    <Grid.Row className={ styles.adminLoginWrapper }>
      <Form className={ styles.adminLoginForm }>
        <Form.Field>
          <label>Username</label>
          <input placeholder='Username' />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input type="password" placeholder='Password' />
        </Form.Field>
        <Button color="green">Login</Button>
      </Form>
     
    </Grid.Row>
  );
};

export default Admin;
