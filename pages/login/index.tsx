import * as React from 'react';
import { Button, Form, Icon, Input, Label, Popup } from "semantic-ui-react";
// next imports //
import Link from "next/link";
import { useRouter } from "next/router";
// redux and actions //
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "../../redux/actions/authActions";
// additional components //
import { GenErrorModal } from "../../components/modals/GenErrorModal";
// style //
import styles from "../../styles/login/LoginPage.module.css";
// types //
import type { GetStaticProps, GetStaticPropsResult } from "next";
import type { Dispatch } from "redux";
import type { InputOnChangeData } from "semantic-ui-react";
import type { IGeneralState } from "../../redux/_types/generalTypes";
import type { AuthAction } from '../../redux/_types/auth/actionTypes';
// helpers //
import { loginFormValidator } from "../../components/_helpers/validators";

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
  // action handlers //
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
      router.push("/admin/dashboard");
    } catch (error) {
      AuthActions.handleAuthError(dispatch, error)
    }
  };
  // end action handlers //
 
  // lifecycle hooks //
  React.useEffect(() => {
    if (error || errorMessages) setLoginFormState(state => ({ ...state, errorCompOpen: true }));
  }, [ error, errorMessages ])

  React.useEffect(() => {
    if (loggedIn) {
      if (isAdmin) router.push("/admin/dashboard");
      else router.push("/");
    }
  }, [ loggedIn, isAdmin, router ])

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
      <div className={ styles.loginFormHeader }>
        <h1>Login</h1>
      </div>
      <div className={ styles.loginFormContainer }>
        <Form>
          <Form.Field inline error={ loginFormState.emailError ? true : false }>
            <Label style={{ width: "75px" }} content="Email: " />
            <Input icon="mail"  iconPosition="left" placeholder="Email..." onChange={ handleEmaiInputChange } />
          </Form.Field>
          <Form.Field error={ loginFormState.passwordError ? true : false } inline className={ styles.passwordField }>
            <Label style={{ width: "75px" }} content="Password: " />
            <Input placeholder="Password..." type={showPassword ? "text": "password"} onChange={ handlePasswordChange } />
            <Popup
              content={`${showPassword ? "Hide" : "Show"} password`}
              trigger={ <span><Icon onClick={ handlePasswordHideClick } name="hide" /></span> }
            />
              
          </Form.Field>
        </Form>
        <div className={ styles.loginDiv }>
          <Button fluid color="green" onClick={ handleLogin }>Login</Button>
        </div>
        <div className={ styles.loginDivBottom }>
          <div className={ styles.loginDivBottomTitle }>Don&apos;t have an account?</div>
          <Link href={"/register"} ><a>Register</a></Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

