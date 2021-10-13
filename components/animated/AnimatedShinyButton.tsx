import * as React from 'react';
import styles from "@/styles/animated/AnimatedShinyButton.module.css";

interface IAnimatedShinyButtonProps {
  content: string;
  onClick?(e: React.MouseEvent<HTMLDivElement>, { value }: { value?: string }): void; 
  value?: string;
}

export const AnimatedShinyButton: React.FunctionComponent<IAnimatedShinyButtonProps> = ({ content, onClick, value }): JSX.Element => {
  return (
    <div className={ styles.shinyButton } onClick={ (e) => onClick(e, { value }) }>
      { content }
    </div>
  );
};
