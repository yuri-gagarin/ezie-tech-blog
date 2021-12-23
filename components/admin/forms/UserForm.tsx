import * as React from 'react';
import { Dropdown, Form } from 'semantic-ui-react';
// types //
import type { DropdownItemProps, DropdownProps } from "semantic-ui-react"
// styles //
import styles from "@/styles/admin/forms/UserForm.module.css";
// types //


interface IUserFormProps {

}

type UserFormState = {
  firstName: string;
  lastName: string;
  email: string;
  userRole: "READER" | "CONTRIBUTOR" | "";

}
const dropdownVals: DropdownItemProps[] = [
  { key: 1, text: "Reader", value: "READER" },
  { key: 2, text: "Contributor", value: "CONTRIBUTORR" }
];

export const PostForm: React.FunctionComponent<IUserFormProps> = ({ }): JSX.Element => {
  const [ userFormState, setUserFormState ] = React.useState<UserFormState>({ firstName: "", lastName: "", email: "", userRole: "" });

  // action handlers //
  const handleUserFirstNameChange = (e:  React.FormEvent<HTMLInputElement>): void => {
    setUserFormState({ ...userFormState, firstName: e.currentTarget.value });
  };
  const handleUserLastNameChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setUserFormState({ ...userFormState, lastName: e.currentTarget.value });
  };
  const handleUserRoleChange = (_, data: DropdownProps): void => {
    const { value } = data;
    setUserFormState({ ...userFormState, userRole: value as "READER" || "CONTRIBUTOR" });
  };
  const handleUserEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserFormState({ ...userFormState, email: e.currentTarget.value });
  };

  return (
    <Form className={ styles.adminPostForm } data-test-id="admin-user-form">
      <Form.Field>
        <label>First Name:</label>
        <input value={ userFormState.firstName } placeholder="Users first name..." onChange={ handleUserFirstNameChange }  data-test-id="user-form-first-name-input" />
      </Form.Field>
      <Form.Field>
        <label>Last Name:</label>
        <input value={ userFormState.lastName } placeholder="Users email..." onChange={ handleUserLastNameChange }  data-test-id="user-form-last-name-input" />
      </Form.Field>
      <Form.Field>
        <label>Email:</label>
        <input value={ userFormState.email } placeholder="" onChange={ handleUserEmailChange } data-test-id="user-form-email-input"  />
      </Form.Field>
      <Form.Field>
        <label>User Role:</label>
        <Dropdown value={ userFormState.userRole ? userFormState.userRole : null } clearable options={ dropdownVals } selection  placeholder="Select User Role" onChange={ handleUserRoleChange } data-test-id="user-form-role-dropdown" />
      </Form.Field>
    </Form>
  );
};

