import * as React from 'react';
import { Grid, List } from "semantic-ui-react";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "../../../../redux/actions/userActions";
// additional component //
import { AdminUserMenu } from "../../../../components/admin/users/AdminUserMenu";
import { AdminRegUserListItem} from "../../../../components/admin/users/AdminRegUserListItem";
// types //
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { Dispatch } from "redux";
import type { UserAction } from '../../../../redux/_types/users/actionTypes';
import type  { IGeneralState } from '../../../../redux/_types/generalTypes';
// styles //
import styles from "../../../../styles/admin/users_pages/AdminUsersPage.module.css";
// helpers //
import { verifyAdminToken } from "../../../../components/_helpers/adminComponentHelpers";
import { AdminLayout } from '../../../../components/admin/AdminLayout';


interface IAdminUsersPageProps {
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
  const token = context.req["signedCookies"].JWTToken;
  let validAdmin: boolean;
  try {
    validAdmin = await verifyAdminToken(token);
  } catch (error) {
    console.log(error);
    validAdmin = false;
  }

  if (validAdmin) {
    return {
      props: { }
    };
  } else {
    return {
      redirect: {
        destination: "/401",
        statusCode: 301,
      },
      props: {
        errorMessages: [ "Not Logged in "] 
      }
    };
  }
};

const AdminUsersPage: React.FunctionComponent<IAdminUsersPageProps> = (props): JSX.Element => {
  // next imports //
  // redux imports and state //
  const dispatch = useDispatch<Dispatch<UserAction>>();
  const { authState, usersState } = useSelector((state: IGeneralState) => state);

  React.useEffect(() => {
    const { authToken: JWTToken, loggedIn } = authState;
    if (JWTToken && loggedIn) UserActions.handleGetUsers({ dispatch, JWTToken });
  }, [ dispatch, authState ]);

  return (
    <AdminLayout>
      <Grid padded className={ styles.adminUsersPageGrid } >
        <Grid.Row className={ styles.adminUserMainRow }>
          <Grid.Column>
            <List divided relaxed>
              {
                usersState.usersArr.map((userData) => {
                  return (
                    <AdminRegUserListItem
                      key={ userData._id }
                      userData={ userData }
                    />
                  )
                })
              }
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </AdminLayout>
  );
};

export default AdminUsersPage;
