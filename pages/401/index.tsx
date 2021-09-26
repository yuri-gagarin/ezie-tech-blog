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

  // lifecycle hooks //
  React.useEffect(() => {
    if (loggedIn && authToken && expires && loggedInAt) {
      const expirationTime = ms(expires as StringValue) + loggedInAt;
      if (expirationTime <  Date.now()) AuthActions.handleClearLoginState(dispatch);
    }
  }, [ loggedIn, loggedInAt, authToken, expires, dispatch ]);

  return (
    <div className={ styles.notAllowedPageWrapper }>
      <Segment style={{ width: "100%" }} textAlign="center">
        <Header>Not Allowed</Header>
        <div className={ styles.errorStatus }>401</div>
        <Container>
          <Button basic color="green" icon={"home"} content="Home" />
        </Container>
      </Segment>
    </div>
  );
};

export default NotAllowedPage;
