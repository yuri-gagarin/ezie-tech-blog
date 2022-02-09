import * as React from 'react';
import { Grid } from "semantic-ui-react";
// additional components //
import { MobileMenuSidebar } from '../sidebars/MobileMenuSidebar';
import { AdminMenu } from '../admin/AdminMenu';
// styles //
import layoutStyles from "@/styles/layout/LayoutStyle.module.css";
// helpers //
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";

interface IAdminLayoutProps {
  pageProps: any;
}

export const AdminLayout: React.FunctionComponent<IAdminLayoutProps> = ({ children, pageProps }): JSX.Element => {
  // custom hooks //
  const { width } = useWindowSize();
  return (
    <Grid className={ `${layoutStyles.layoutWrapper} ${ width < 550 ? layoutStyles.mobileView : ""}` }>
      {
        width > 550 
        ?
        <>
          <AdminMenu { ...pageProps }/>
          { children }
        </>
        :
       < MobileMenuSidebar>
        { children }
       </MobileMenuSidebar>
      }     
    </Grid>
  );
};

