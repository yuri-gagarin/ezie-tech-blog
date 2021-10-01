import * as React from 'react';
import { Grid } from "semantic-ui-react";
// components which are to be always displayed //
import { NavMenu } from '../navs/NavMenu';
import { MobileMenuSidebar } from '../sidebars/MobileMenuSidebar';
import Footer from '../footer/Footer';
// styles //
import layoutStyles from "../../styles/layout/LayoutStyle.module.css";
// helpers //
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";

interface ILayoutProps {
  pageProps: any;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({ children, pageProps }): JSX.Element => {
  // custom hooks //
  const { width } = useWindowSize();
  return (
    <Grid className={ layoutStyles.layoutWrapper }>
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
  )
};

export default Layout;
