import * as React from 'react';
import { Form } from 'semantic-ui-react';

interface IUserPassInputProps {
  handlePassChange: React.ChangeEventHandler<HTMLInputElement>;
  handleConfirmPassChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const UserPassInput: React.FunctionComponent<IUserPassInputProps> = ({ handlePassChange }) => {
  return (
    <React.Fragment>
      <Form.Field>
        <label>Password:</label>
        <input onChange={ handlePassChange }></input>
      </Form.Field>
      <Form.Field>
        <label>Password Confirm:</label>
        <input></input>
      </Form.Field>
    </React.Fragment>
  );
};

