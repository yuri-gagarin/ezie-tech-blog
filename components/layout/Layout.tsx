import * as React from 'react';
import { NavMenu } from '../navs/NavMenu';
import { Grid } from "semantic-ui-react";
// styles //
import layoutStyles from "../../styles/layout/LayoutStyle.module.css";

interface ILayoutProps {
}

const Layout: React.FunctionComponent<ILayoutProps> = ({ children }): JSX.Element => {
  return (
    <Grid className={ layoutStyles.layoutWrapper }>
      <NavMenu />
      { children }
    </Grid>
  )
};

export default Layout;
