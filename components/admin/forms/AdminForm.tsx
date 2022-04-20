import * as React from 'react';
import { Button, Dropdown, Form, Icon, Radio } from 'semantic-ui-react';
// additional components //
import { AdminUserNav } from "@/components/admin/users/AdminUsersNav";
import { UserPassInput } from "@/components/shared/forms/UserPassInput";
// styles //
import styles from "@/styles/admin/forms/AdminForm.module.css";
// types //
import type { IAdminState } from '@/redux/_types/generalTypes';
import type { DropdownItemProps, DropdownProps } from "semantic-ui-react";
// helpers //
import { checkEmptyObjVals } from "@/components/_helpers/displayHelpers"
import { AdminActions } from '@/redux/actions/adminActions';
import { UserPassGenerator } from '../../shared/forms/UserPassGenerator';

interface IAdminFormProps {
  usersState: IAdminState;
  handleSaveAdmin(userFormData: AdminFormState): Promise<any>;
  handleCancelAdmin(): void;
  handleMuteAdmin(): Promise<any>;
}

export type AdminFormState = {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "owner" | "";
  confirmed: boolean;
  password: string;
  passwordConfirm: string;
};
type PassFormState = {
  inputFormOpen: boolean;
  generatorFormOpen: boolean;
};

const dropdownVals: DropdownItemProps[] = [
  { key: 1, text: "Admin", value: "admin" },
  { key: 2, text: "Owner", value: "owner" } 
];

export const AdminForm: React.FunctionComponent<IAdminFormProps> = ({ usersState, handleSaveAdmin, handleCancelAdmin, handleMuteAdmin }): JSX.Element => {
  // local component state //
  const [ userFormState, setAdminFormState ] = React.useState<AdminFormState>({ firstName: "", lastName: "", email: "", role: "", confirmed: false, password: "", passwordConfirm: "" });
  const [ passFormState, setPassFormState ] = React.useState<PassFormState>({ inputFormOpen: false, generatorFormOpen: false });

  // action handlers //
  const handleAdminFirstNameChange = (e:  React.FormEvent<HTMLInputElement>): void => {
    setAdminFormState({ ...userFormState, firstName: e.currentTarget.value });
  };
  const handleAdminLastNameChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setAdminFormState({ ...userFormState, lastName: e.currentTarget.value });
  };
  const handleAdminRoleChange = (_, data: DropdownProps): void => {
    const { value } = data;
    setAdminFormState({ ...userFormState, role: value as "admin" || "owner" });
  };
  const handleAdminEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAdminFormState({ ...userFormState, email: e.currentTarget.value });
  };
  const handleConfirmedChange = (e: React.MouseEvent<HTMLInputElement>): void => {
    setAdminFormState({ ...userFormState, confirmed: !userFormState.confirmed });
  };
  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setAdminFormState({ ...userFormState, passwordConfirm: e.currentTarget.value });
  };
  const handleConfirmPassChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setAdminFormState({ ...userFormState, password: e.currentTarget.value });
  };

  
  return (
    <div className={ styles.adminAdminFormWrapper }>
      <AdminUserNav 
        saveUser={ () => handleSaveAdmin(userFormState) } 
        cancelNewUser={ handleCancelAdmin } 
        handleMuteUser={ handleMuteAdmin }
      />
      <Form className={ styles.adminAdminForm } data-test-id="admin-user-form">
        <Form.Field>
          <label>First Name:</label>
          <input value={ userFormState.firstName } placeholder="Admins first name..." onChange={ handleAdminFirstNameChange }  data-test-id="user-form-first-name-input" />
        </Form.Field>
        <Form.Field>
          <label>Last Name:</label>
          <input value={ userFormState.lastName } placeholder="Admins email..." onChange={ handleAdminLastNameChange }  data-test-id="user-form-last-name-input" />
        </Form.Field>
        <Form.Field>
          <label>Email:</label>
          <input value={ userFormState.email } placeholder="" onChange={ handleAdminEmailChange } data-test-id="user-form-email-input"  />
        </Form.Field>
        <Form.Field>
          <label>Admin Role:</label>
          <Dropdown value={ userFormState.role ? userFormState.role : null } clearable options={ dropdownVals } selection  placeholder="Select Admin Role" onChange={ handleAdminRoleChange } data-test-id="user-form-role-dropdown" />
        </Form.Field>
        <Form.Field>
          <label>Confirmed:</label>
          <Radio toggle checked={userFormState.confirmed} onClick={ handleConfirmedChange } />
        </Form.Field>
        <Form.Field>
          <label>Password:</label>
          <Button.Group>
            <Button basic color="green" onClick={ () => setPassFormState({ inputFormOpen: !passFormState.inputFormOpen, generatorFormOpen: false }) }>
              <Icon name="keyboard outline"  />
              Custom Password
            </Button>
            <Button.Or className={ styles.passwordOrBtn } />
            <Button basic color="blue" onClick={ () => setPassFormState({ generatorFormOpen: !passFormState.generatorFormOpen, inputFormOpen: false }) } >
              <Icon name="lock" />
              Generate Random Secure Password
            </Button>
          </Button.Group>
        </Form.Field>
        {
          passFormState.inputFormOpen 
          ? 
            <UserPassInput 
              handlePassChange={ handlePasswordChange } 
              handleConfirmPassChange={ handleConfirmPassChange } 
            /> 
          : null  
        }
        {
          passFormState.generatorFormOpen ? <UserPassGenerator /> : null
        }
      </Form>
    </div>
  );
};

