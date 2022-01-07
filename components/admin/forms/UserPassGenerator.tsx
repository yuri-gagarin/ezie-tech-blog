import * as React from 'react';
import { Button, Form, Icon } from 'semantic-ui-react';
// helpers //
import { generatePassword } from "@/components/_helpers/generalHelpers";

interface IUserPassGeneratorProps {
}

export const UserPassGenerator: React.FunctionComponent<IUserPassGeneratorProps> = (props): JSX.Element => {
  // local component state //
  const [ generatedPassword, setGeneratedPassword ] = React.useState<string>("");

  // lifecycle hooks //
  React.useEffect(() => {
    setGeneratedPassword(generatePassword(10));
  }, []);

  return (
    <React.Fragment>
      <Form.Field>
        <label>Generated Password:</label>
        <div>{generatedPassword}</div>
      </Form.Field>
      <Form.Field>
        <Button basic color="blue" onClick={ () => setGeneratedPassword(generatePassword()) }>
          <Icon name="sync"/>
          Regenerate
        </Button>
      </Form.Field>
    </React.Fragment>
   
  )
};

