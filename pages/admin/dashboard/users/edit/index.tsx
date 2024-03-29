import * as React from 'react';
import { Grid } from "semantic-ui-react";
// next //
import { useRouter } from "next/router";
// redux and actions //
import { useDispatch, useSelector } from 'react-redux';
import { UserActions } from "@/redux/actions/userActions";
// additional components //
import { AdminLayout } from '@/components/layout/AdminLayout';
//
import styles from "@/styles/user/NewUserComponent.module.css";

interface IUserNewComponentProps {
  
}

const NewUserComponent: React.FunctionComponent<IUserNewComponentProps> = (props): JSX.Element => {

  const handleSaveUser = async () => {

  };

  return (
    <AdminLayout>
      <Grid.Row className={ styles.navRow }>

      </Grid.Row>
      <Grid.Row className={ styles.formRow }>

      </Grid.Row>

    </AdminLayout>
  );
};

export default NewUserComponent;
