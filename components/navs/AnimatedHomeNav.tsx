import * as React from 'react';
// additional components //
import { AnimatedShinyButton } from '../animated/AnimatedShinyButton';
// styles //
import styles from "@/styles/navs/AnimatedHomeNav.module.css";


interface IAnimatedHomeNavProps {
  handleScrollToContent(e: React.MouseEvent<HTMLDivElement>, data: { value?: string }): void;
}

export const AnimatedHomeNav: React.FunctionComponent<IAnimatedHomeNavProps> = ({ handleScrollToContent }): JSX.Element => {
  return (
    <div className={ styles.animatedHomeNavWrapper }>
       <div className={ styles.buttonDiv } >
        <AnimatedShinyButton content="News" onClick={ handleScrollToContent } value='news' />
      </div>
      <div className={ styles.buttonDiv }  >
        <AnimatedShinyButton content="Blog" onClick={ handleScrollToContent } value='blog' />
      </div>
      <div className={ styles.buttonDiv } >
        <AnimatedShinyButton content="Projects" onClick={ handleScrollToContent } value='project' />
      </div>
      <div className={ styles.buttonDiv } >
        <AnimatedShinyButton content="About" onClick={ handleScrollToContent } value='about' />
      </div>
    </div>
  );
};

