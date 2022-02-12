import * as React from 'react';
import { Grid } from "semantic-ui-react";
// redux imports //
import { useSelector, shallowEqual, useDispatch } from "react-redux";
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
// type imports //
import type { IGeneralAppAction, IGeneralState } from '@/redux/_types/generalTypes';
import type { Dispatch } from "redux";


interface ILayoutProps {
  pageProps: any;
}



const Layout: React.FunctionComponent<ILayoutProps> = ({ children, pageProps }): JSX.Element => {
  // local comp state //
  // custom hooks //
  const { width } = useWindowSize();
  // redux hooks //
  const authState = useSelector((state: IGeneralState) => state.authState, shallowEqual)
  const dispatch: Dispatch<IGeneralAppAction> = useDispatch();
  // lifecycle hooks //
  //const loginStatus = listenForNewAuthStatus();

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
