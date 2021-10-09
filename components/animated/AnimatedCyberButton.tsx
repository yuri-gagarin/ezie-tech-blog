import * as React from 'react';
// styles //
import styles from "@/styles/animated/AnimatedCyberBtn.module.css";

interface IAdnimatedButtonProps {
  content: string;
}

export const AnimatedCyberButton: React.FunctionComponent<IAdnimatedButtonProps> = ({ content }): JSX.Element => {
  return (
    <button className={ `${styles.animatedCyberBtn}` }>
      Glitch<span aria-hidden={ true }>_</span>
      <span className={ styles.cyberBtnGlitch } aria-hidden={ true }>${content}_</span>
    </button>
  );
};

