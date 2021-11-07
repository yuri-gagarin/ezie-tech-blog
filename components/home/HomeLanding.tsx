import * as React from 'react';
import { Grid } from "semantic-ui-react";
// addtional imports //
import { MainTitle } from "@/components/headers/MainTitle";
import { AnimatedCyberButton } from "@/components/animated/AnimatedCyberButton";
import { AnimatedScrollingCode } from "@/components/animated/AnimatedScrollingCode";
// styles //
import styles from "@/styles/home/HomeLanding.module.css";

interface IHomeLandingProps {
  handleSeeMore(): void;
};
export const HomeLanding: React.FunctionComponent<IHomeLandingProps> = ({ handleSeeMore }): JSX.Element => {
  return (
    <Grid.Row className={ styles.wrapperRow } data-test-id="Home_Landing_Component" >
      <div className={ styles.landingMain }> 
        <AnimatedScrollingCode />
        <div className={ styles.imgOverlay}> 
        </div> 
        <div className={ styles.titleWrapper }>
          <MainTitle />
        </div>
       
        <div className={ styles.seeMoreBtnWrapper } data-test-id="Home_Landing_See_More_Btn">
          <AnimatedCyberButton 
            content="More" 
            clip="clipLeftBottom" 
            color="violet" 
            pauseInterval={ 3000 } 
            onClick={ handleSeeMore }
          />
        </div>
        <div className={ styles.landingDescription }>
          <span>Read</span>
          <span>Learn</span>
          <span>Plan</span>
          <span>Relax</span>
        </div>
      </div>
    </Grid.Row>
  );
};
