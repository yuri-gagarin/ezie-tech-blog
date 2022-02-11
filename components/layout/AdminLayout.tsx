import * as React from 'react';
import { Grid } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// redux hooks //
import { useSelector } from "react-redux";
// additional components //
import { MobileMenuSidebar } from '../sidebars/MobileMenuSidebar';
import { AdminMenu } from '../admin/AdminMenu';
// types //
import type { IGeneralState } from "@/redux/_types/generalTypes";
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
  // next hooks //
  const router = useRouter();
  const { authState } = useSelector((state: IGeneralState) => state);

  // lifecycle hooks //
  React.useEffect(() => {

  }, [ router ]);

  React.useEffect(() => {
    if (!authState.loggedIn) router.push("/login");
  });

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

