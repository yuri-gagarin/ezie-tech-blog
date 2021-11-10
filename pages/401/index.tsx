import * as React from 'react';
import { Button, Container, Header, Segment } from "semantic-ui-react";
// next imports //
import { useRouter } from "next/router";
// redux imports //
import { useDispatch, useSelector } from "react-redux";
// ms conversion util //
import ms from "ms";
// types //
import type { Dispatch } from "redux";
import type { StringValue } from "ms";
import type { AuthAction } from '../../redux/_types/auth/actionTypes';
import type { IGeneralState } from '../../redux/_types/generalTypes';
// styles //
import styles from "../../styles/general_pages/NotAllowedPage.module.css";
import { AuthActions } from '../../redux/actions/authActions';


interface INotAllowedPageProps {
}

const NotAllowedPage: React.FunctionComponent<INotAllowedPageProps> = (props) => {
  // next hooks //
  const router = useRouter();
  // redux hooks and state //
  const dispatch = useDispatch<Dispatch<AuthAction>>();
  const { loggedIn, loggedInAt, authToken, expires } = useSelector((state: IGeneralState) => state.authState);

  const handleRedirect = async (e: React.MouseEvent<HTMLButtonElement>): Promise<any> => {
    const innerVal: string = e.currentTarget.dataset["routeto"];
    console.log(innerVal)
    console.log(e.currentTarget.dataset)
    if (!innerVal) return; // needs a better error handler here //
    return router.push(`${innerVal}`);
  }
  // lifecycle hooks //
  React.useEffect(() => {
    if (loggedIn && authToken && expires && loggedInAt) {
      const expirationTime = ms(expires as StringValue) + loggedInAt;
      if (expirationTime <  Date.now()) AuthActions.handleClearLoginState(dispatch);
    }
  }, [ loggedIn, loggedInAt, authToken, expires, dispatch ]);

  return (
    <div className={ styles.notAllowedPageWrapper }>
      <div className={ styles.mainContent }>
        <h1>401</h1>
        <div className={ styles.errorStatus }>Not Allowed</div>
        <div>Looks like you took a wrong turn and need to log in</div>
        <div className={ styles.controlsContainer }>
          <Button fluid basic color="green" icon={"home"} content="Home" data-routeto="/" data-test-id="401_Home_Btn" onClick={ handleRedirect } />
          <Button.Group fluid>
            <Button style={{ width: "50%"}} basic color="green" data-routeto="/login" data-test-id="401_Login_Btn" onClick={ handleRedirect }>Login</Button>
            <Button.Or />
            <Button style={{ width: "50%"}}  basic color="blue" data-routeto="/register" data-test-id="401_Register_Btn" onClick={ handleRedirect }>Register</Button>
          </Button.Group>
        </div>
      </div>
    </div>
  );
};

export default NotAllowedPage;
