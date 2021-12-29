import * as React from 'react';
import { Form } from 'semantic-ui-react';

interface IUserPassInputProps {
}

export const UserPassInput: React.FunctionComponent<IUserPassInputProps> = (props) => {
  return (
    <React.Fragment>
      <Form.Field>
        <label>Password:</label>
        <input></input>
      </Form.Field>
      <Form.Field>
        <label>Password Confirm:</label>
        <input></input>
      </Form.Field>
    </React.Fragment>
  );
};

