import * as React from 'react';
// styles //
import styles from "@/styles/headers/MainTitle.module.css";

interface IMainTitleProps {
}

export const MainTitle: React.FunctionComponent<IMainTitleProps> = (props): JSX.Element => {
  return (
    <div className={ styles.headerWrapper }>
      <h3 className={ styles.tech}>Tech</h3>
      <h1 className={ styles.mainTitle }>EEZIE</h1>
    </div>
  );
};