import * as React from 'react';
import { Button, Form, Icon, Input, Label, Popup } from "semantic-ui-react";
// next imports //
import { GetStaticProps, GetStaticPropsResult } from "next";
// redux and actions //
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "../../redux/actions/authActions";
// additional components //
import { GenErrorModal } from "../../components/modals/GenErrorModal";
// style //
import styles from "../../styles/login/LoginPage.module.css";
// types //
import type { Dispatch } from "redux";
import type { InputOnChangeData } from "semantic-ui-react";
import type { IAuthState, IGeneralState } from "../../redux/_types/generalTypes";
import type { AuthAction } from '../../redux/_types/auth/actionTypes';
// helpers //

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
  const [ errorCompOpen, setErrorCompOpen ] = React.useState<boolean>(false);
  const [ showPassword, setShowPassword ] = React.useState<boolean>(false);
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<AuthAction>>();
  const { error, errorMessages } = useSelector((state: IGeneralState) => state.authState);
  // action handlers //
  const handleEmaiInputChange = (_, data: InputOnChangeData): void => {
    setLoginFormState({ ...loginFormState, email: data.value });
  };
  const handlePasswordChange = (_, data: InputOnChangeData): void => {
    setLoginFormState({ ...loginFormState, password: data.value });
  };

  const handleErrorModalClose = (): void => {
    AuthActions.dismissLoginError(dispatch);
    setErrorCompOpen(false);
  };
  const handlePasswordHideClick = (): void => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (): Promise<any> => {
    const { email, password } = loginFormState;
    if (!email || !password) return;
    await AuthActions.handleLogin(dispatch, { email, password });
  };
  // end action handlers //
 
  // lifecycle hooks //
  React.useEffect(() => {
    if (error || errorCompOpen) setErrorCompOpen(true);
  }, [ error, errorMessages ])

  return (
    <div className={ styles.loginWrapper }>
      <GenErrorModal animation="zoom" duration={ 300 } open={ errorCompOpen } handleErrorModalClose={ handleErrorModalClose } header="Login Error" errorMessages={ errorMessages }/>
      <div className={ styles.loginFormHeader }>
        <h1>Login</h1>
      </div>
      <div className={ styles.loginFormContainer }>
        <Form>
          <Form.Field inline>
            <Label style={{ width: "75px" }} content="Email: " />
            <Input icon="mail"  iconPosition="left" placeholder="Email..." onChange={ handleEmaiInputChange } />
          </Form.Field>
          <Form.Field inline className={ styles.passwordField }>
            <Label style={{ width: "75px" }} content="Password: " />
            <Input placeholder="Password..." type={showPassword ? "text": "password"} onChange={ handlePasswordChange } />
            <Popup
              content={`${showPassword ? "Hide" : "Show"} password`}
              trigger={ <span><Icon onClick={ handlePasswordHideClick } name="hide" /></span> }
            />
              
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

