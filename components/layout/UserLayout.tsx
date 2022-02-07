import * as React from 'react';
import { Grid } from "semantic-ui-react";
// additional components //
import { MobileMenuSidebar } from '../sidebars/MobileMenuSidebar';
import { UserMenu } from '../user/UserMenu';
// styles //
import layoutStyles from "@/styles/layout/LayoutStyle.module.css";
// helpers //
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";

interface IUserLayoutProps {
  pageProps: any;
}

/*
export const UserLayout: React.FunctionComponent<IUserLayoutProps> = ({ children }): JSX.Element => {
  return (
    <React.Fragment>
      <UserMenu />
      {  children }
    </React.Fragment>
  );
};
*/

export const UserLayout: React.FunctionComponent<IUserLayoutProps> = ({ children, pageProps }): JSX.Element => {
  // custom hooks //
  const { width } = useWindowSize();
  return (
    <Grid className={ `${layoutStyles.layoutWrapper} ${ width < 550 ? layoutStyles.mobileView : ""}` }>
      {
        width > 550 
        ?
        <>
          <UserMenu { ...pageProps }/>
          { children }
        </>
        :
       < MobileMenuSidebar>
        { children }
       </MobileMenuSidebar>
      }     
    </Grid>
  )
};

