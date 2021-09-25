import * as React from 'react';
import { Container, Grid, Header, Icon, Segment } from "semantic-ui-react";
// types //
// import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import styles from "../../styles/projects/ProjectsPage.module.css";

interface IProjectsPageProps {

}

const ProjectsPage: React.FunctionComponent<IProjectsPageProps> = (props): JSX.Element => {
  return (
    <Grid stackable divided className={ styles.projectsPageGrid }>
      <Grid.Row className={ styles.projectRow } columns={2}>
        <Grid.Column color="purple" width={ 8 }>
          <Segment className={ styles.titleSegment }>
            <Header>Project title</Header>
            <div>A project description here fefefe</div>
            <div></div>
          </Segment>
        </Grid.Column>
        <Grid.Column width={ 8 }>
          
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className={ styles.projectRow } columns={2}>
        <Grid.Column width={ 8 }>
        </Grid.Column>
        <Grid.Column color="purple" width={ 8 }>
          <Segment className={ styles.titleSegment }>
            <Header>Project title</Header>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ProjectsPage;
