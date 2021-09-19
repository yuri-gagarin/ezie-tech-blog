import * as React from 'react';
import { Button, Form, Input, Label } from "semantic-ui-react";
// next imports //
import { GetStaticProps, GetStaticPropsResult } from "next";
// additional components //
import { GenErrorModal } from "../../components/modals/GenErrorModal";
// style //
import styles from "../../styles/login/LoginPage.module.css";
// types //
import type { InputOnChangeData } from "semantic-ui-react";

interface ILoginPageProps {

}

export const getStaticProps: GetStaticProps = (): GetStaticPropsResult<any> => {
  return {
    props: {}
  };
};

const LoginPage: React.FunctionComponent<ILoginPageProps> = (): JSX.Element => {
  // local component state and hooks //
  const [ loginFormState, setLoginFormState ] = React.useState<{ email: string; password: string; }>({ email: "", password: "" });
  const [ errorCompOpen, setErrorCompOpen ] = React.useState<boolean>(true);

  // action handlers //
  const handleEmaiInputChange = (_, data: InputOnChangeData): void => {
    setLoginFormState({ ...loginFormState, email: data.value });
  };
  const handlePasswordChange = (_, data: InputOnChangeData): void => {
    setLoginFormState({ ...loginFormState, password: data.value });
  };

  const handleErrorModalClose = (): void => {
    setErrorCompOpen(false);
  };

  const handleLogin = async (): Promise<any> => {
    // TODO //
    // set login and user state //
    setErrorCompOpen(true);
  };
  // end action handlers //

  return (
    <div className={ styles.loginWrapper }>
      <GenErrorModal animation="zoom" duration={ 300 } open={ errorCompOpen } handleErrorModalClose={ handleErrorModalClose }/>
      <div className={ styles.loginFormHeader }>
        <h1>Login</h1>
      </div>
      <div className={ styles.loginFormContainer }>
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

export default LoginPage;

