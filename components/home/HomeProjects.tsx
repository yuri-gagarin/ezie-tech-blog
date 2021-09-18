import * as React from 'react';
import { Button, Grid } from 'semantic-ui-react';
//
import projectsHomeStyles from "../../styles/home/HomeProjects.module.css";

interface IProjectsHomeProps {
}

export const HomeProjects: React.FunctionComponent<IProjectsHomeProps> = (props): JSX.Element => {
  return (
    <Grid.Row className={ projectsHomeStyles.projectsWrapper }> 
      <div className={ projectsHomeStyles.projectsTitle } >
        Recent and Past Projects
      </div>
      <div className={ projectsHomeStyles.projectsDetails }>
        <div className={ projectsHomeStyles.projectsLeft }> 
          <p className={ projectsHomeStyles.projectsLeftContent }>
            Every project, every idea, every case is different. There is not one single language, not one single framework to tackle every use case.
            We do love our favorites of course but always keep an open mind and learn and keep up to date. The indusrty only moves forward and we with it.
          </p>
        </div>
        <div className={ projectsHomeStyles.projectsRight }>
          <div className={ projectsHomeStyles.projectsRightTitle }>
            <p>What we&apos;re working on</p>
          </div>
          <div className={ projectsHomeStyles.projectsMoreBtn }>
            <Button color="purple" content={"See More"} />

          </div>
        </div>

      </div>
     
    </Grid.Row>
  )
};