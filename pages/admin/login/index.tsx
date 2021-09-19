import * as React from 'react';
import { Button, Form, Input, Label } from "semantic-ui-react";
// next imports //
import { GetStaticProps, GetStaticPropsResult } from "next";
// style //
import styles from "../../../styles/admin/AdminLoginStyles.module.css";
// types //
import type { InputOnChangeData } from "semantic-ui-react";

interface IAdminLoginProps {

}

export const getStaticProps: GetStaticProps = (): GetStaticPropsResult<any> => {
  return {
    props: {}
  };
};

const AdminLogin: React.FunctionComponent<IAdminLoginProps> = (props): JSX.Element => {
  // local component state and hooks //
  const [ loginFormState, setLoginFormState ] = React.useState<{ email: string; password: string; }>({ email: "", password: "" });

  // action handlers //
  const handleEmaiInputChange = (_, data: InputOnChangeData): void => {
    setLoginFormState({ ...loginFormState, email: data.value });
  };
  const handlePasswordChange = (_, data: InputOnChangeData): void => {
    setLoginFormState({ ...loginFormState, password: data.value });
  };

  const handleLogin = async (): Promise<any> => {
    // TODO //
    // set login and user state //
  };

  return (
    <div className={ styles.adminLoginWrapper }>
      <div className={ styles.adminLoginFormHeader }>
        <h1>Login</h1>
      </div>
      <div className={ styles.adminLoginFormContainer }>
        <Form>
          <Form.Field inline>
            <Label style={{ width: "75px" }} content="Email: " />
            <Input  icon="mail"  iconPosition="left" placeholder="Email..." onChange={ handleEmaiInputChange } />
          </Form.Field>
          <Form.Field inline>
            <Label style={{ width: "75px" }} content="Password: " />
            <Input icon="hide"  iconPosition="left" placeholder="Password..." type={"password"} onChange={ handlePasswordChange } />
          </Form.Field>
        </Form>
        <div className={ styles.loginDiv }>
          <Button size="small" color="green" onClick={ handleLogin }>Login</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

