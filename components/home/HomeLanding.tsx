import * as React from 'react';
import { Grid } from "semantic-ui-react";
// addtional imports //
import { MainTitle } from "@/components/headers/MainTitle";
import { AnimatedCyberButton } from '../animated/AnimatedCyberButton';
// styles //
import styles from "@/styles/home/HomeLanding.module.css";

interface IHomeLandingProps {
  handleSeeMore(): void;
};
export const HomeLanding: React.FunctionComponent<IHomeLandingProps> = ({ handleSeeMore }): JSX.Element => {
  return (
    <Grid.Row className={ styles.wrapperRow } >
      <div className={ styles.rowLeft }> 
        <MainTitle />
        <div className={ styles.seeMoreBtnWrapper }>
          <AnimatedCyberButton 
            content="More" 
            clip="clipLeftBottom" 
            color="violet" 
            pauseInterval={ 5000 } 
            onClick={ handleSeeMore }
          />
        </div>
      </div>
      <div className={ styles.rowRight }> 
        <div className={ styles.topRight }>
          <span>Demystifying today&apos;s</span>
          <span>technoloogy</span> 
          <span>one step at a time.</span>
        </div>
        <div className={ styles.rightDescription }>
          <span>Read</span>
          <span>Learn</span>
          <span>Plan</span>
          <span>Relax</span>
          <span>Take it eezie</span>
        </div>
      </div>
    </Grid.Row>
  );
};
/*
<div className={ styles.logoDiv }>
  <div>Eezie</div>
  <div>Tech</div>
</div>
*/