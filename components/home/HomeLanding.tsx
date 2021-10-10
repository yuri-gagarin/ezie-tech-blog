import * as React from 'react';
import { Grid } from "semantic-ui-react";
// addtional imports //
import { MainTitle } from "@/components/headers/MainTitle";
import { AnimatedCyberButton } from '../animated/AnimatedCyberButton';
import { AnimatedShinyButton } from '../animated/AnimatedShinyButton';
import { AnimatedScrollingCode } from '../animated/AnimatedScrollingCode';
// styles //
import styles from "@/styles/home/HomeLanding.module.css";

interface IHomeLandingProps {
  handleSeeMore(): void;
};
export const HomeLanding: React.FunctionComponent<IHomeLandingProps> = ({ handleSeeMore }): JSX.Element => {
  return (
    <Grid.Row className={ styles.wrapperRow } >
      <div className={ styles.landingMain }> 
        <AnimatedScrollingCode />
        <div className={ styles.imgOverlay}> 
        </div> 
        <div className={ styles.titleWrapper }>
          <MainTitle />
        </div>
       
        <div className={ styles.seeMoreBtnWrapper }>
          <AnimatedCyberButton 
            content="More" 
            clip="clipLeftBottom" 
            color="violet" 
            pauseInterval={ 3000 } 
            onClick={ handleSeeMore }
          />
        </div>
        <div className={ styles.rightDescription }>
          <span>Read</span>
          <span>Learn</span>
          <span>Plan</span>
          <span>Relax</span>
        </div>
        <div className={ styles.controlBtns }>
          <AnimatedShinyButton content="Blog" />
          <AnimatedShinyButton content="Projects" />
          <AnimatedShinyButton content="News" />
          <AnimatedShinyButton content="About" />

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

/*
  <div className={ styles.rowLeft }> 
    <MainTitle />
   
  </div>
  <div className={ styles.rowRight }>   
    <AnimatedScrollingCode />
   
    <div className={ styles.rightSocial }>
    </div>
    <div className={ styles.rightDescription }>
      <span>Read</span>
      <span>Learn</span>
      <span>Plan</span>
      <span>Relax</span>
    </div>
    <div className={ styles.topRight }>
      <span>Today&apos;s</span>
      <span>tech</span> 
      <span>made</span>
      <span>easy</span>
    </div>
  </div>
*/