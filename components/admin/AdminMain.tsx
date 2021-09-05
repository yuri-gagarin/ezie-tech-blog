import * as React from 'react';
import { Grid } from "semantic-ui-react";
import { useRouter } from 'next/router';
// styles //
import adminMainStyles from "../../styles/admin/AdminMain.module.css";

interface IAdminMainProps {
}

export const AdminMain: React.FunctionComponent<IAdminMainProps> = (props): JSX.Element => {
  const router = useRouter();
  return (
    <Grid.Row className={ adminMainStyles.adminMainRow }> 
      <Grid.Column className={ adminMainStyles.leftColumn } width={5}>

      </Grid.Column>
      <Grid.Column className={ adminMainStyles.rightColumn } width={11}>

      </Grid.Column>
    </Grid.Row>
  );
};

