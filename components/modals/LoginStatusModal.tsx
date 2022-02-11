import * as React from 'react';
// next imports //
import Link from "next/link";
// semantic ui imports //
import { Button, Icon, Label} from "semantic-ui-react";
// dependencies //
import { EuiAuthDisplay } from '../_helpers/custom_hooks/listenForNewAuthStatus';
// styles //
import styles from "@/styles/modals/LoginStatusModal.module.css";

interface ILoginStatusModalProps {
  loginStatus: EuiAuthDisplay;
  dismissLoggedOut(): void;
}

export const LoginStatusModal: React.FunctionComponent<ILoginStatusModalProps> = ({ loginStatus, dismissLoggedOut }): JSX.Element => {

  React.useEffect(() => {
    console.log(loginStatus)
  }, [ loginStatus ]);
  return (
   
    <Label size="big" color="purple" onClick={ dismissLoggedOut } style={{ position: "fixed", right: "10px", top: "50px", zIndex: 999999 }}>
      <Icon name="log out" />
      { loginStatus }
    </Label>
  );
};
