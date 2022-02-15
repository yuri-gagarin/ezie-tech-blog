import * as React from 'react';
import { Grid } from "semantic-ui-react";
// redux imports //
// components which are to be always displayed //
import { NavMenu } from '../navs/NavMenu';
import { MobileMenuSidebar } from '../sidebars/MobileMenuSidebar';
import Footer from '../footer/Footer';
// additional components //
// styles //
import layoutStyles from "@/styles/layout/LayoutStyle.module.css";
// helpers //
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";
// type imports //

interface ILayoutProps {
  pageProps: any;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({ children, pageProps }): JSX.Element => {
  // local comp state //
  // custom hooks //
  const { width } = useWindowSize();
  // redux hooks //

  return (
    <React.Fragment>
      <Grid className={ `${layoutStyles.layoutWrapper} ${ width < 550 ? layoutStyles.mobileView : ""}` }>
        {
          width > 550 
          ?
          <>
            <NavMenu { ...pageProps }/>
            { children }
          </>
          :
        < MobileMenuSidebar>
          { children }
        </MobileMenuSidebar>
        }
      
        <Footer />
      </Grid>
    </React.Fragment>
  );
};

export default Layout;
