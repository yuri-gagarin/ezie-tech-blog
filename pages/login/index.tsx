import * as React from 'react';
import { Button, Form, Icon, Input, Label, Popup } from "semantic-ui-react";
// next imports //
import Link from "next/link";
import { useRouter } from "next/router";
// redux and actions //
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "@/redux/actions/authActions";
// additional components //
import { AuthNav } from "@/components/navs/AuthNav";
import { GenErrorModal } from "@/components/modals/GenErrorModal";
// style //
import styles from "@/styles/login/LoginPage.module.css";
// types //
import type { GetStaticProps, GetStaticPropsResult } from "next";
import type { Dispatch } from "redux";
import type { InputOnChangeData } from "semantic-ui-react";
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { AuthAction } from '@/redux/_types/auth/actionTypes';
// helpers //
import { loginFormValidator } from "@/components/_helpers/validators";
import { clearClientSessionCookie } from "@/components/_helpers/generalHelpers";

interface ILoginPageProps {

}
type LoginFormState = {
  email: string;
  password: string;
  emailError: string | null;
  passwordError: string | null;
  errorMessages: string[] | null;
  errorCompOpen: boolean;
};

export const getStaticProps: GetStaticProps = (): GetStaticPropsResult<any> => {
  return {
    props: {}
  };
};

const LoginPage: React.FunctionComponent<ILoginPageProps> = (): JSX.Element => {
  // local component state and hooks //
  const [ loginFormState, setLoginFormState ] = React.useState<LoginFormState>({ email: "", password: "", emailError: null, passwordError: null, errorMessages: null, errorCompOpen: false });
  const [ showPassword, setShowPassword ] = React.useState<boolean>(false);
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<AuthAction>>();
  const { error, errorMessages, loggedIn, isAdmin } = useSelector((state: IGeneralState) => state.authState);

  // event listeners //
  const handleEmaiInputChange = (_, data: InputOnChangeData): void => {
    if (data.value.length === 0) {
      setLoginFormState({ ...loginFormState, email: data.value, emailError: "Please enter your email" });
    } else {
      setLoginFormState({ ...loginFormState, email: data.value, emailError: null });
    }
  };
  const handlePasswordChange = (_, data: InputOnChangeData): void => {
    if (data.value.length === 0) {
      setLoginFormState({ ...loginFormState, password: data.value, passwordError: "Please enter your password" });
    } else {
      setLoginFormState({ ...loginFormState, password: data.value, passwordError: null });
    }
  };

  // action handlers //
  const handleGoBack = (): void => {
    router.back();
  };
  const handleGoHome = (): void => {
    router.push("/");
  };
  const handleErrorModalClose = (): void => {
    if (error || errorMessages) AuthActions.dismissAuthError(dispatch);
    setLoginFormState({ ...loginFormState, errorCompOpen: false, errorMessages: null });
  };
  const handlePasswordHideClick = (): void => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (): Promise<any> => {
    const { email, password, emailError, passwordError } = loginFormState;
    const { valid, errorMessages } = loginFormValidator({ email, password, emailError, passwordError });
    if (!valid) return setLoginFormState({ ...loginFormState, errorCompOpen: true, errorMessages });
    
    try {
      await AuthActions.handleLogin(dispatch, { email, password });
    } catch (error) {
      AuthActions.handleAuthError(dispatch, error)
    }
  };
  // end action handlers //
 
  // lifecycle hooks //
  React.useEffect(() => {
    clearClientSessionCookie({ cookieName: "authState" });
  }, []);

  React.useEffect(() => {
    if (error || errorMessages) setLoginFormState(state => ({ ...state, errorCompOpen: true }));
  }, [ error, errorMessages ]);
  
  React.useEffect(() => {
    if (loggedIn && isAdmin) {
      router.push("/admin/dashboard");
    } else if (loggedIn && !isAdmin) {
      router.push("/user/dashboard");
    } else {
      return;
    }
  }, [ loggedIn, isAdmin, router ]);

  return (
    <div className={ styles.loginWrapper }>
      <GenErrorModal 
        animation="slide down" 
        duration={ 300 } 
        open={ loginFormState.errorCompOpen } 
        handleErrorModalClose={ handleErrorModalClose } 
        header="Login Error" 
        errorMessages={ errorMessages ? errorMessages : loginFormState.errorMessages } 
        position={"fixed-top"}
      />
      <div className={ styles.loginFormAuthNav }>
        <AuthNav 
          handleGoBack={ handleGoBack }
          handleGoHome={ handleGoHome }
        />
      </div>
      <div className={ styles.loginFormHeader } data-test-id="login-page-header">
        <h1>Login</h1>
      </div>
      <div className={ styles.loginFormContainer } data-test-id="login-page-form-container">
        <Form>
          <Form.Field inline error={ loginFormState.emailError ? true : false }>
            <Label style={{ width: "75px" }} content="Email: " />
            <Input className={ styles.textInput } icon="mail"  iconPosition="left" placeholder="Email..." onChange={ handleEmaiInputChange } data-test-id="login-page-email-input" />
          </Form.Field>
          <Form.Field error={ loginFormState.passwordError ? true : false } inline className={ styles.passwordField }>
            <Label style={{ width: "75px" }} content="Password: " />
            <Input className={ styles.textInput } placeholder="Password..." type={showPassword ? "text": "password"} onChange={ handlePasswordChange } data-test-id="login-page-password-input" />
            <Popup
              content={`${showPassword ? "Hide" : "Show"} password`}
              trigger={ <span><Icon onClick={ handlePasswordHideClick } name="hide" /></span> }
            />
              
          </Form.Field>
        </Form>
        <div className={ styles.loginDiv }>
          <Button fluid color="green" onClick={ handleLogin } data-test-id="login-page-login-btn">Login</Button>
        </div>
        <div className={ styles.loginDivBottom }>
          <h4>Don&apos;t have an account?</h4>
          <Link href={"/register"}><a data-test-id="login-page-register-link">Register</a></Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

