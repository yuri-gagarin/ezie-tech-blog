import * as React from 'react';
import { Button, Form, Icon, Input, Label, Popup } from "semantic-ui-react";
// next imports //
import Link from "next/link";
import type { GetStaticProps, GetStaticPropsResult } from "next";
import { useRouter } from "next/router";
// redux and actions //
import type { Dispatch } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "@/redux/actions/authActions";
// additional components //
import { GenErrorModal } from "@/components/modals/GenErrorModal";
// style //
import styles from "@/styles/register/RegisterPage.module.css";
// types //
import type { InputOnChangeData } from "semantic-ui-react";
import type { IGeneralState } from "@/redux/_types/generalTypes";
import type { AuthAction } from '@/redux/_types/auth/actionTypes';
// helpers //
import { isDefined } from "@/components/_helpers/displayHelpers";
import { registerFormValidator } from "@/components/_helpers/validators";

interface IRegisterPageProps {

}

type LocalFormState = {
  email: string;
  password: string;
  confirmPassword: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  errorMessages: string[] | null;
  errorFormOpen: boolean
}

export const getStaticProps: GetStaticProps = (): GetStaticPropsResult<any> => {
  return {
    props: {}
  };
};

const RegisterPage: React.FunctionComponent<IRegisterPageProps> = (): JSX.Element => {
  // local component state and hooks //
  const [ registerFormState, setRegisterFormState ] = React.useState<LocalFormState>({ 
    email: "", password: "", confirmPassword: "", emailError: "", passwordError: "", confirmPasswordError: "", errorMessages: null, errorFormOpen: false 
  });
  const [ showPassword, setShowPassword ] = React.useState<boolean>(false);
  const [ showPasswordConfirm, setShowPasswordConfirm ] = React.useState<boolean>(false);
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<AuthAction>>();
  const { error, errorMessages, loggedIn, isAdmin } = useSelector((state: IGeneralState) => state.authState);
  // action handlers //
  const handleEmaiInputChange = (_, data: InputOnChangeData): void => {
    if (!data.value) {
      setRegisterFormState({ ...registerFormState, email: data.value, emailError: "Email is required." });
    } else {
      setRegisterFormState({ ...registerFormState, email: data.value, emailError: "" });
    }
  };
  const handlePasswordChange = (_, data: InputOnChangeData): void => {
    if (!data.value) {
      setRegisterFormState({ ...registerFormState, password: data.value, passwordError: "Password is required." });
    } else {
      setRegisterFormState({ ...registerFormState, password: data.value, passwordError: "" });
    }
  };
  const handleConfirmPasswordChange = (_, data: InputOnChangeData): void => {
    if (!data.value) {
      setRegisterFormState({ ...registerFormState, confirmPassword: data.value, confirmPasswordError: "Please confirm your password." });
    } else {
      setRegisterFormState({ ...registerFormState, confirmPassword: data.value, confirmPasswordError: "" });
    }
  };

  const handleErrorModalClose = (): void => {
    if (error || errorMessages) AuthActions.dismissAuthError(dispatch);
    setRegisterFormState({ ...registerFormState, errorFormOpen: false, errorMessages: null });
  };
  const handlePasswordHideClick = (): void => {
    setShowPassword(!showPassword);
  };
  const handlePasswordConfirmHideClick = (): void => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleRegister = async (): Promise<any> => {
    // check for empty fields or mismatched password //
    const { email, password, confirmPassword } = registerFormState;
    const { valid, errorMessages } = registerFormValidator({ email, password, confirmPassword });
    if (!valid && errorMessages.length > 0) {
      setRegisterFormState({ ...registerFormState, errorFormOpen: true, errorMessages });
      return;
    }
    // handle registration //
    try {
      await AuthActions.handleRegistration(dispatch, { email, password, confirmPassword });
      router.push("/");
    } catch (error) {
      return AuthActions.handleAuthError(dispatch, error);
    }
  };
  // end action handlers //
 
  // lifecycle hooks //
  React.useEffect(() => {
    if (error || errorMessages) setRegisterFormState((s) => ({ ...s, errorFormOpen: true }));
  }, [ error, errorMessages ]);
  
  return (
    <div className={ styles.registerWrapper }>
      <GenErrorModal 
        animation={"slide down"} 
        duration={ 500 } 
        open={ registerFormState.errorFormOpen } 
        handleErrorModalClose={ handleErrorModalClose } 
        header="Registration Error" 
        errorMessages={ (errorMessages ? errorMessages : registerFormState.errorMessages) }
        position={ "fixed-top" }
      />
      <div className={ styles.registerFormHeader }>
        <h1>Register</h1>
      </div>
      <div className={ styles.registerFormContainer }>
        <Form>
          <Form.Field inline error={ isDefined(registerFormState.emailError) }>
            <Label style={{ width: "75px" }} content="Email: " />
            <Input className={ styles.textInput } icon="mail"  iconPosition="left" placeholder={`${ registerFormState.emailError ? registerFormState.emailError : "Email..." }`} onChange={ handleEmaiInputChange } />
          </Form.Field>
          <Form.Field inline error={ isDefined(registerFormState.passwordError) } className={ styles.passwordField }>
            <Label style={{ width: "75px" }} content="Password: " />
            <Input className={ styles.textInput } placeholder={`${ registerFormState.passwordError ? registerFormState.passwordError : "Password..." }`} type={showPassword ? "text": "password"} onChange={ handlePasswordChange } />
            <Popup
              content={`${showPassword ? "Hide" : "Show"} password`}
              trigger={ <span><Icon onClick={ handlePasswordHideClick } name={ showPassword ? "hide" : "eye" }/></span> }
            />
              
          </Form.Field>
          <Form.Field inline error={ isDefined(registerFormState.confirmPasswordError) } className={ styles.passwordConfField }>
            <Label style={{ width: "75px" }} content="Confirm Password: " />
            <Input className={ styles.textInput } placeholder={`${ registerFormState.confirmPasswordError ? registerFormState.confirmPasswordError : "Retype password..." }`} type={showPassword ? "text": "password"} onChange={ handleConfirmPasswordChange }/>
            <Popup
              content={`${showPassword ? "Hide" : "Show"} password`}
              trigger={ <span><Icon onClick={ handlePasswordConfirmHideClick } name={ showPasswordConfirm ? "hide" : "eye" }/></span> }
            />
              
          </Form.Field>
        </Form>
        <div className={ styles.registerDiv }>
          <Button fluid color="green" onClick={ handleRegister }>Register</Button>
        </div>
        <div className={ styles.registerDivBottom }>
          <h4>Have an account?</h4>
          <Link href="/login"><a>Login</a></Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

