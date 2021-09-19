import * as React from 'react';
import { Button, Form, Grid, Header } from "semantic-ui-react";
// next //
import type { GetStaticProps, GetStaticPropsResult } from "next";
// styles //
import styles from "../../styles/admin/AdminLogin.module.css";

interface IAdminLoginProps {
}

export const getStaticProps: GetStaticProps =  async (context): Promise<GetStaticPropsResult<any>> => {
  return {
    props: { }
  }
}
const Admin: React.FunctionComponent<IAdminLoginProps> = (props): JSX.Element => {
  return (
    <Grid.Row className={ styles.adminLoginWrapper }>
      <Header as="h2">Login</Header>
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
