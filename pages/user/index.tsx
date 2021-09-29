import * as React from 'react';
import { Button, Form, Grid, Header } from "semantic-ui-react";
// next //
import type { GetStaticProps, GetStaticPropsResult } from "next";
// styles //
import styles from "../../styles/user/UserRegister.module.css";

interface IUserRegisterProps {
}

export const getStaticProps: GetStaticProps =  async (context): Promise<GetStaticPropsResult<any>> => {
  return {
    props: { }
  }
}
const UserRegister: React.FunctionComponent<IUserRegisterProps> = (props): JSX.Element => {
  return (
    <Grid.Row className={ styles.adminLoginWrapper }>
      <Header as="h2">Register</Header>
      <div>
        <Form className={ styles.adminLoginForm }>
          <Form.Field>
            <label>Username</label>
            <input placeholder='Username' />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input type="password" placeholder='Password' />
          </Form.Field>
          <Form.Field>
            <label>Confirm Password</label>
            <input type="password" placeholder='Confirm Password' />
          </Form.Field>
        </Form>
      </div>
    </Grid.Row>
  );
};

export default UserRegister;
