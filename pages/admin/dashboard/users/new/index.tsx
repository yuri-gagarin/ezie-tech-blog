import * as React from 'react';
import { Grid } from "semantic-ui-react";
// next //
import { useRouter } from "next/router";
// redux and actions //
import { useDispatch, useSelector } from 'react-redux';
import { UserActions } from "@/redux/actions/userActions";
// additional components //
import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserForm } from "@/components/admin/forms/UserForm"
//
import styles from "@/styles/admin/users_pages/NewUserComponent.module.css";
// types //
import type { UserFormState } from "@/components/admin/forms/UserForm";
import type { IGeneralState } from '@/redux/_types/generalTypes';

interface IUserNewComponentProps {
  
}

const NewUserComponent: React.FunctionComponent<IUserNewComponentProps> = (): JSX.Element => {
  // next hooks //
  const { usersState } = useSelector((state: IGeneralState) => state);

  const handleSaveUser = async (userData: UserFormState) => {

  };
  const handleCancelUser = () => {

  };
  const handleMuteUser = async () => {

  };

  return (
    <AdminLayout>
      <Grid.Row className={ styles.navRow }>
      </Grid.Row>
      <Grid.Row className={ styles.formRow }>
        <UserForm 
          usersState={ usersState } 
          handleSaveUser={ handleSaveUser }
          handleCancelUser={ handleCancelUser }
          handleMuteUser={ handleMuteUser }
        />
      </Grid.Row>

    </AdminLayout>
  );
};

export default NewUserComponent;
