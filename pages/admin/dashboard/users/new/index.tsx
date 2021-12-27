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

interface IUserNewComponentProps {
  
}

const NewUserComponent: React.FunctionComponent<IUserNewComponentProps> = (): JSX.Element => {

  const handleSaveUser = async () => {

  };
  const handleCancelUser = () => {

  };

  return (
    <AdminLayout>
      <Grid.Row className={ styles.navRow }>
      </Grid.Row>
      <Grid.Row className={ styles.formRow }>
        <UserForm />
      </Grid.Row>

    </AdminLayout>
  );
};

export default NewUserComponent;
