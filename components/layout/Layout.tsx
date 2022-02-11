import * as React from 'react';
import { Grid } from "semantic-ui-react";
// redux imports //
// components which are to be always displayed //
import { NavMenu } from '../navs/NavMenu';
import { MobileMenuSidebar } from '../sidebars/MobileMenuSidebar';
import Footer from '../footer/Footer';
// additional components //
import { LoginStatusModal } from "@/components/modals/LoginStatusModal";
// styles //
import layoutStyles from "@/styles/layout/LayoutStyle.module.css";
// helpers //
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";
import { listenForNewAuthStatus } from "@/components/_helpers/custom_hooks/listenForNewAuthStatus";
// type imports //
import type { EuiAuthDisplay } from "@/components/_helpers/custom_hooks/listenForNewAuthStatus";


interface ILayoutProps {
  pageProps: any;
}



const Layout: React.FunctionComponent<ILayoutProps> = ({ children, pageProps }): JSX.Element => {
  // local comp state //
  // custom hooks //
  const { width } = useWindowSize();
  // redux hooks //
  // lifecycle hooks //
  const loginStatus = listenForNewAuthStatus();

  return (
    <React.Fragment>
      <LoginStatusModal
        loginStatus={ loginStatus }
        dismissLoggedOut={ () => {} }
      />
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
