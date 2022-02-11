import * as React from 'react';
import { Grid } from "semantic-ui-react";
// redux imports //
import { useSelector } from "react-redux";
// additional components //
import { MobileMenuSidebar } from '../sidebars/MobileMenuSidebar';
import { UserMenu } from '../user/UserMenu';
// styles //
import layoutStyles from "@/styles/layout/LayoutStyle.module.css";
// helpers //
import { useWindowSize } from "@/components/_helpers/monitorWindowSize";
import { IGeneralState } from '@/redux/_types/generalTypes';

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

  // lifecycle hooks //
  React.useEffect(() => {
    console.log(authState);
  }, [ authState ]);

  return (
    <React.Fragment>
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

