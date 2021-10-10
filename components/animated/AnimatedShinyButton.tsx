import * as React from 'react';
import styles from "@/styles/animated/AnimatedShinyButton.module.css";

interface IAnimatedShinyButtonProps {
  content: string;
  onClick?(e: React.MouseEvent<HTMLDivElement>): void; 
}

export const AnimatedShinyButton: React.FunctionComponent<IAnimatedShinyButtonProps> = ({ content, onClick }): JSX.Element => {
  return (
    <div className={ styles.shinyButton } onClick={ onClick }>
      { content }
    </div>
  );
};
