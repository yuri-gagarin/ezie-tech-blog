import * as React from 'react';
import { TransitionablePortal } from "semantic-ui-react";
// types //
import type { SemanticTRANSITIONS } from "semantic-ui-react";
// styles //
import styles from "@/styles/modals/GenInfoModal.module.css";

interface IGenInfoModalProps {
  open: boolean;
  animation?: SemanticTRANSITIONS;
  duration?: number;
  header?: string;
  messages?: string[];
  handleInfoModalClose(): void;
  position?: "fixed-top" | "fixed-bottom";
}

export const GenInfoModal: React.FunctionComponent<IGenInfoModalProps> = ({ open, animation = "fly down", duration = 1500, header, messages, handleInfoModalClose, position }): JSX.Element => {
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
      onClose={ handleInfoModalClose }
    >
      <div className={( position ? postStyle : styles.infoSegment)}>
        <div className={ styles.infoHeader }>{ header ? header : "Not Possible" }</div>
        <div className={ styles.infoMessagesWrapper }>
          <ul className={ styles.infoMessagesList }>
            {
              (messages && messages.length > 0) 
              ? 
                messages.map((msg) => <li key={msg} className={ styles.message }>{ msg }</li>)
              :
              <li key="msg" className={ styles.message }>Seems like something went wrong.</li>
            }
          </ul>
        </div>
      </div>

    </TransitionablePortal>
  );
};