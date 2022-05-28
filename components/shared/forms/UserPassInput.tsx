import * as React from 'react';
import { Form, Icon, Input, Label } from 'semantic-ui-react';
// styles //
import styles from "@/styles/shared/forms/UserPassInput.module.css";

// Local types and interfaces //
type UserPassErrorState = {
  passwordErrorText: string | null;
  passwordConfirmErrorText: string | null;
}
interface IUserPassInputProps {
  changePassword?: boolean;
  handleOldPassChange?: React.ChangeEventHandler<HTMLInputElement>;
  handlePassChange: React.ChangeEventHandler<HTMLInputElement>;
  handleConfirmPassChange: React.ChangeEventHandler<HTMLInputElement>;
  oldPasswordErrMsg?: string | null;
  passwordErrMsg?: string | null;
  passwordConfErrMsg?: string | null;
}
//

export const UserPassInput: React.FunctionComponent<IUserPassInputProps> = ({ changePassword, handleOldPassChange, handlePassChange, handleConfirmPassChange, oldPasswordErrMsg, passwordErrMsg, passwordConfErrMsg }): JSX.Element => {

  return (
    <React.Fragment>
      {
        changePassword && handleOldPassChange &&
        <Form.Group className={ styles.passInputGroup }>
        <label className={ styles.passInputLabel }>Current Password:</label>
          <Form.Input 
            className={ styles.passInput }
            error={ oldPasswordErrMsg ? { content: oldPasswordErrMsg, pointing: "below" } : false } 
            icon="lock"
            onChange={ handleOldPassChange } 
            type="password"
            placeholder={ "Current Password" }
          />
        </Form.Group>
      }
      <Form.Group className={ styles.passInputGroup }>
        <label className={ styles.passInputLabel }>{ changePassword ? "New Password:" : "Password:"}</label>
        <Form.Input
          className={ styles.passInput }
          error={ passwordErrMsg ? { content: passwordErrMsg, pointing: "below" } : false } 
          icon="lock"
          onChange={ handlePassChange } 
          type="password"
          placeholder={ "New Password" }
        />
      </Form.Group>
      <Form.Group className={ styles.passInputGroup }>
      <label className={ styles.passInputLabel }>{ changePassword ? "Confirm New Password:" : "Confirm Password:" }</label>
        <Form.Input
          className={ styles.passInput }
          error={ passwordConfErrMsg ? { content: passwordConfErrMsg, pointing: "below" } : false }
          icon="lock"
          onChange={ handleConfirmPassChange } 
          type="password"
          placeholder={ "Confirm New Password" }
        />
      </Form.Group>
    </React.Fragment>     
  );
};

