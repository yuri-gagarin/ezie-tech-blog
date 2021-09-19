import * as React from 'react';
import { Segment, TransitionablePortal } from "semantic-ui-react";
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
}

export const GenErrorModal: React.FunctionComponent<IGenErrorModalProps> = ({ open, animation = "fly down", duration = 1500, header, errorMessages, handleErrorModalClose }): JSX.Element => {

  return (
    <TransitionablePortal 
      open={ open }
      transition={{ animation, duration }}
      onClose={ handleErrorModalClose }
    >
      <div className={ styles.errorSegment }>
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