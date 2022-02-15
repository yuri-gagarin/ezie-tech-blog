import * as React from 'react';
import { Grid } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// redux hooks //
import { useSelector, useDispatch } from "react-redux";
// additional components //
import { AdminMenu } from '../admin/AdminMenu';
import { LoginStatusModal } from "@/components/modals/LoginStatusModal";
import { MobileMenuSidebar } from '../sidebars/MobileMenuSidebar';
// types //
import type { Dispatch } from 'redux';
import type { IGeneralAppAction, IGeneralState } from '@/redux/_types/generalTypes';
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
  // redux hooks //
  const { authState } = useSelector((state: IGeneralState) => state);
  const dispatch: Dispatch<IGeneralAppAction> = useDispatch();

  return (
    <Grid className={ `${layoutStyles.layoutWrapper} ${ width < 550 ? layoutStyles.mobileView : ""}` }>
      <LoginStatusModal
        authState={ authState }
        dispatch={ dispatch }
      />
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

