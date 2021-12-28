import * as React from 'react';
import { Button, Dropdown, Form, Icon, Radio } from 'semantic-ui-react';
// additional components //
import { AdminUserNav } from "@/components/admin/users/AdminUsersNav";
// styles //
import styles from "@/styles/admin/forms/UserForm.module.css";
// types //
import type { IUserState } from '@/redux/_types/generalTypes';
import type { DropdownItemProps, DropdownProps } from "semantic-ui-react";
// helpers //
import { checkEmptyObjVals } from "@/components/_helpers/displayHelpers"
import { UserActions } from '@/redux/actions/userActions';

interface IUserFormProps {
  usersState: IUserState;
  handleSaveUser(userFormData: UserFormState): Promise<any>;
  handleCancelUser(): void;
  handleMuteUser(): Promise<any>;
}

export type UserFormState = {
  firstName: string;
  lastName: string;
  email: string;
  userRole: "READER" | "CONTRIBUTOR" | "";
  confirmed: boolean;
};

const dropdownVals: DropdownItemProps[] = [
  { key: 1, text: "Reader", value: "READER" },
  { key: 2, text: "Contributor", value: "CONTRIBUTORR" }
];

export const UserForm: React.FunctionComponent<IUserFormProps> = ({ usersState, handleSaveUser, handleCancelUser, handleMuteUser }): JSX.Element => {
  const [ userFormState, setUserFormState ] = React.useState<UserFormState>({ firstName: "", lastName: "", email: "", userRole: "", confirmed: false });


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
  const handleConfirmedChange = (e: React.MouseEvent<HTMLInputElement>): void => {
    setUserFormState({ ...userFormState, confirmed: !userFormState.confirmed });
  };

  
  return (
    <div className={ styles.adminUserFormWrapper }>
      <AdminUserNav 
        saveUser={ () => handleSaveUser(userFormState) } 
        cancelNewUser={ handleCancelUser } 
        handleMuteUser={ handleMuteUser }
      />
      <Form className={ styles.adminUserForm } data-test-id="admin-user-form">
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
        <Form.Field>
          <label>Confirmed:</label>
          <Radio toggle checked={userFormState.confirmed} onClick={ handleConfirmedChange } />
        </Form.Field>
        <Form.Field>
          <label>Password:</label>
          <Button.Group>
            <Button basic color="green">
              <Icon name="keyboard outline"  />
              Custom Password
            </Button>
            <Button.Or className={ styles.passwordOrBtn } />
            <Button basic color="blue">
              <Icon name="lock" />
              Generate Random Secure Password
            </Button>
          </Button.Group>
        </Form.Field>
      </Form>
    </div>
  );
};

