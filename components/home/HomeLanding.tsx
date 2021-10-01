import * as React from 'react';
import { Grid } from "semantic-ui-react";
// addtional imports //
import { MainTitle } from "@/components/headers/MainTitle";
// styles //
import homeLandingStyle from "@/styles/home/HomeLanding.module.css";

interface IHomeLandingProps {

};
export const HomeLanding: React.FunctionComponent<IHomeLandingProps> = (props): JSX.Element => {
  return (
    <Grid.Row className={ homeLandingStyle.wrapperRow } >
      <div className={ homeLandingStyle.rowLeft }> 
        <MainTitle />
      </div>
      <div className={ homeLandingStyle.rowRight }> 
        <div className={ homeLandingStyle.topRight }>
          <span>Demystifying today&apos;s</span>
          <span>technoloogy</span> 
          <span>one step at a time.</span>
        </div>
        <div className={ homeLandingStyle.rightDescription }>
          <span>Read</span>
          <span>Learn</span>
          <span>Plan</span>
          <span>Relax</span>
          <span>Take it &apos;eezie&apos;</span>
        </div>
      </div>
    </Grid.Row>
  );
};
/*
<div className={ homeLandingStyle.logoDiv }>
  <div>Eezie</div>
  <div>Tech</div>
</div>
*/