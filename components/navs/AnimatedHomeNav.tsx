import * as React from 'react';
// additional components //
import { AnimatedShinyButton } from '../animated/AnimatedShinyButton';
// styles //
import styles from "@/styles/navs/AnimatedHomeNav.module.css";


interface IAnimatedHomeNavProps {
}

export const AnimatedHomeNav: React.FunctionComponent<IAnimatedHomeNavProps> = (props): JSX.Element => {
  return (
    <div className={ styles.animatedHomeNavWrapper }>
      <div className={ styles.buttonDiv } >
        <AnimatedShinyButton content="Blog" />
      </div>
      <div className={ styles.buttonDiv } >
        <AnimatedShinyButton content="Projects" />
      </div>
      <div className={ styles.buttonDiv } >
        <AnimatedShinyButton content="News" />
      </div>
      <div className={ styles.buttonDiv } >
        <AnimatedShinyButton content="About" />
      </div>
    </div>
  );
};

