import * as React from 'react';
import { Grid } from "semantic-ui-react";
// redux imports //
import { UserActions } from "../../../../redux/actions/userActions";
// additional component //
import { AdminUserMenu } from "../../../../components/admin/users/AdminUserMenu";
import { AdminRegisteredUsers } from "../../../../components/admin/users/AdminRegisteredUsers";
// styles //
import styles from "../../../../styles/admin/users_pages/AdminUsersPage.module.css";

interface IAdminUsersPageProps {
}

const AdminUsersPage: React.FunctionComponent<IAdminUsersPageProps> = (props): JSX.Element => {
  return (
    <Grid padded className={ styles.adminUsersPageGrid } >
      <Grid.Row className={ styles.adminUserMenuRow }>
        <AdminUserMenu />
      </Grid.Row>
      <Grid.Row className={ styles.adminUserMainRow }>
        <Grid.Column>
          <AdminRegisteredUsers />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default AdminUsersPage;
