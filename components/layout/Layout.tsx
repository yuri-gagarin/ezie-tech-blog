import * as React from 'react';
import { Grid } from "semantic-ui-react";
// components which are to be always displayed //
import { NavMenu } from '../navs/NavMenu';
import Footer from '../footer/Footer';
// styles //
import layoutStyles from "../../styles/layout/LayoutStyle.module.css";

interface ILayoutProps {
}

const Layout: React.FunctionComponent<ILayoutProps> = ({ children }): JSX.Element => {
  return (
    <Grid className={ layoutStyles.layoutWrapper }>
      <NavMenu />
      { children }
      <Footer />
    </Grid>
  )
};

export default Layout;
