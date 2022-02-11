import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
// types //
import type { IGeneralState } from '@/redux/_types/generalTypes';
import type { IAuthState } from '@/redux/_types/auth/dataTypes';

export enum EuiAuthDisplay {
  DisplayLogin = "DisplayLogin",
  DisplayLogout = "DisplayLogout",
  None = "None"
}

export const listenForNewAuthStatus = () => {
  const [ uiAuthStatus, setUiAuthStatus ] = useState<EuiAuthDisplay>(EuiAuthDisplay.None);
  const { authState } = useSelector((state: IGeneralState) => state);
  //
  const loggedInRef: React.MutableRefObject<boolean> = useRef(authState.loggedIn);

  useEffect(() => {
    const { loggedIn } = authState;
    // check for user log out //
    if (loggedIn && loggedInRef.current !== loggedIn) {
      loggedInRef.current = loggedIn;
      setUiAuthStatus(EuiAuthDisplay.DisplayLogin);
    } else if (!loggedIn && loggedInRef.current !== loggedIn) {
      loggedInRef.current = loggedIn;
      setUiAuthStatus(EuiAuthDisplay.DisplayLogout)
    } else {
      setUiAuthStatus(EuiAuthDisplay.None);
    }
  });

  return uiAuthStatus;
}