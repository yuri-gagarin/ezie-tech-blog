import * as React from 'react';
import { TransitionablePortal } from "semantic-ui-react";
// types //
import type { SemanticTRANSITIONS } from "semantic-ui-react";
// styles //
import styles from "../../styles/modals/GenErrorModal.module.css";

interface IGenErrorModalProps {
  open: boolean;
  animation?: SemanticTRANSITIONS;
  duration?: number;
  header?: string;
  errorMessages?: string[];
  handleErrorModalClose(): void;
  position?: "fixed-top" | "fixed-bottom";
}

export const GenErrorModal: React.FunctionComponent<IGenErrorModalProps> = ({ open, animation = "fly down", duration = 1500, header, errorMessages, handleErrorModalClose, position }): JSX.Element => {
  const [ postStyle, setPostStyle ] = React.useState<string>("");

  React.useEffect(() => {
    if (position) {
      if (position === "fixed-top") {
        setPostStyle(styles.fixedTop);
      }
      if (position === "fixed-bottom") {
        setPostStyle(styles.fixedBottom);
      }
    }
  }, [ position ]);
  return (
    <TransitionablePortal 
      open={ open }
      transition={{ animation, duration }}
      onClose={ handleErrorModalClose }
    >
      <div className={( position ? postStyle : styles.errorSegment)}>
        <div className={ styles.errorHeader }>{ header ? header : "An Error Occured" }</div>
        <div className={ styles.errorMessagesWrapper }>
          <ul className={ styles.errorMessagesList }>
            {
              (errorMessages && errorMessages.length > 0) 
              ? 
                errorMessages.map((msg) => <li key={msg} className={ styles.message }>{ msg }</li>)
              :
              <li key="msg" className={ styles.message }>Seems like something went wrong.</li>
            }
          </ul>
        </div>
      </div>

    </TransitionablePortal>
  );
};