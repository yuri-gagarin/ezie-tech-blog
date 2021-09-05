import * as React from 'react';
import { Grid } from "semantic-ui-react";
// additonal components //
import { AdminMenu } from '../../../../components/admin/AdminMenu';
// styles //
import adminPostsIndexStyle from "../../../../styles/admin/AdminPostsIndex.module.css";

interface IAdminPostsIndexProps {
}

/// TODO //
// CREATE A LAYOUT FOR ADMIN //

const AdminPostsIndex: React.FunctionComponent<IAdminPostsIndexProps> = (props): JSX.Element => {
  return (
    <React.Fragment>
      <Grid.Row className={ adminPostsIndexStyle.menuRow }>
        <AdminMenu />
      </Grid.Row>
      <Grid.Row className={ adminPostsIndexStyle.postsRow }> 
      </Grid.Row>
    </React.Fragment>
  );
};

export default AdminPostsIndex;
