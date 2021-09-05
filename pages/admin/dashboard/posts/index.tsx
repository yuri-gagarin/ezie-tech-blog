import * as React from 'react';
import { Grid } from "semantic-ui-react";
// additonal components //
import { AdminLayout } from '../../../../components/admin/AdminLayout';
// styles //
import adminPostsIndexStyle from "../../../../styles/admin/AdminPostsIndex.module.css";

interface IAdminPostsIndexProps {
}

/// TODO //
// CREATE A LAYOUT FOR ADMIN //

const AdminPostsIndex: React.FunctionComponent<IAdminPostsIndexProps> = (props): JSX.Element => {
  return (
    <AdminLayout>
      <Grid.Row className={ adminPostsIndexStyle.postsRow }> 
      </Grid.Row>
    </AdminLayout>     
  );
};

export default AdminPostsIndex;
