import * as React from 'react';
import { Grid } from "semantic-ui-react";
// components which are to be always displayed //
import { NavMenu } from '../navs/NavMenu';
import Footer from '../footer/Footer';
// styles //
import layoutStyles from "../../styles/layout/LayoutStyle.module.css";

interface ILayoutProps {
  pageProps: any;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({ children, pageProps }): JSX.Element => {
  return (
    <Grid relaxed className={ layoutStyles.layoutWrapper }>
      <NavMenu { ...pageProps }/>
      { children }
      <Footer />
    </Grid>
  )
};

export default Layout;
