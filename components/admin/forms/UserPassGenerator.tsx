import * as React from 'react';
import { Form } from 'semantic-ui-react';

interface IUserPassGeneratorProps {
}

export const UserPassGenerator: React.FunctionComponent<IUserPassGeneratorProps> = (props): JSX.Element => {
  return (
    <React.Fragment>
      <Form.Field>
        <label></label>
        <input />
      </Form.Field>
    </React.Fragment>
   
  )
};

