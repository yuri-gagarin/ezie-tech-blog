import * as React from 'react';
import { Grid } from "semantic-ui-react";
// redux imports //
import { useSelector, useDispatch } from "react-redux";
// additional components //
import { LoginStatusModal } from "@/components/modals/LoginStatusModal";
import { MobileMenuSidebar } from '../sidebars/MobileMenuSidebar';
import { UserMenu } from '../user/UserMenu';
// styles //
import layoutStyles from "@/styles/layout/LayoutStyle.module.css";
// helpers //
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";
// type imports //
import type { Dispatch } from 'redux';
import type { IGeneralAppAction, IGeneralState } from '@/redux/_types/generalTypes';

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
  // redux hooks //
  const { authState } = useSelector((state: IGeneralState) => state);
  const dispatch: Dispatch<IGeneralAppAction> = useDispatch();


  return (
    <React.Fragment>
      <LoginStatusModal 
        authState={ authState }
        dispatch={ dispatch }
      />
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
    </React.Fragment>
  )
};

