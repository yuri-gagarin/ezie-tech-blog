import * as React from 'react';
// next imports //
// semantic ui imports //
import { Icon, Label} from "semantic-ui-react";
// redux actions //
import { AuthActions } from "@/redux/actions/authActions";
// dependencies //
// styles //
import styles from "@/styles/modals/LoginStatusModal.module.css";
// types imports //
import type { IAuthState } from '@/redux/_types/auth/dataTypes';
import type { Dispatch } from 'redux';
import type { AuthAction } from '@/redux/_types/auth/actionTypes';

interface ILoginStatusModalProps {
  authState: IAuthState;
  dispatch: Dispatch<AuthAction>
}

type LocalState = {
  showMessage: boolean;
  messageContent: string;
  messageTimeout: NodeJS.Timeout | null;
}

export const LoginStatusModal: React.FunctionComponent<ILoginStatusModalProps> = ({ authState, dispatch }): JSX.Element => {
  const [ localState, setLocalState ] = React.useState<LocalState>({ showMessage: false, messageContent: "", messageTimeout: null });

  const setMessageTimeout = (): NodeJS.Timeout => {
    return setTimeout(() => {
      AuthActions.handleClearLoginMsg({ dispatch });
    }, 3000);
  };
  const clearLoginStatusMessage = (): void => {
    clearTimeout(localState.messageTimeout);
    setLocalState({ showMessage: false, messageContent: "", messageTimeout: null });
  };

  // lifecycle hooks //
  React.useEffect(() => {
    if (authState.showLoginMsg) {
      setLocalState({ 
        showMessage: true, 
        messageContent: authState.responseMsg,
        messageTimeout: setMessageTimeout()
      });
    }
    return () => {
      console.log("ran clear timeout")
      clearTimeout(localState.messageTimeout);
    };
  }, [ authState ]);

  

  return (
    localState.showMessage 
    ?
      <Label size="big" color="purple" onClick={ clearLoginStatusMessage } style={{ position: "fixed", right: "10px", top: "50px", zIndex: 999999 }}>
        <Icon name="log out" />
        { localState.messageContent }
      </Label>
    :
      null
  );
};
