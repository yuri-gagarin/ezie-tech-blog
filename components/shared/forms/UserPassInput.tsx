import * as React from 'react';
import { Form, Icon, Input, Label } from 'semantic-ui-react';
// styles //
import styles from "@/styles/shared/forms/UserPassInput.module.css";

interface IUserPassInputProps {
  changePassword?: boolean;
  handleOldPassChange?: React.ChangeEventHandler<HTMLInputElement>;
  handlePassChange: React.ChangeEventHandler<HTMLInputElement>;
  handleConfirmPassChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const UserPassInput: React.FunctionComponent<IUserPassInputProps> = ({ changePassword, handleOldPassChange, handlePassChange, handleConfirmPassChange }) => {
  
  const passInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {

  };
  const passConfirmInputChange= (e: React.ChangeEvent<HTMLInputElement>): void => {

  };

  return (
    <React.Fragment>
      {
        changePassword && handleOldPassChange &&
        <Form.Field>
          <label>Old Password: </label>
          <Input onChange={ handlePassChange } />
        </Form.Field>
      }
      <Form.Group className={ styles.passInputGroup }>
        <label className={ styles.inputLabel }>{ changePassword ? "New Password:" : "Password:"}</label>
        <Form.Input
          error={{ content: "Field cannot be blank", pointing: "below" }} 
          icon="lock"
          onChange={ handlePassChange } 
          type="password"
        />
      </Form.Group>
      <Form.Group className={ styles.passInputGroup }>
      <label className={ styles.inputLabel }>{ changePassword ? "Confirm New Password:" : "Confirm Password:" }</label>
        <Form.Input
          error={{ content: "Field cannot be blank", pointing: 'below' }}
          icon="lock"
          onChange={ handleConfirmPassChange } 
          type="password"
        />
      </Form.Group>
    </React.Fragment>     
  );
};

